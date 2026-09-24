import logging
import uuid
from contextlib import asynccontextmanager
from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI, Request, Response, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)
logger = logging.getLogger(__name__)


MODEL_DIRECTORY = Path(__file__).resolve().parent.parent / "models"
MODEL_FILES = {
    "linear_regression": "linear_regression.joblib",
    "decision_tree": "decision_tree.joblib",
    "random_forest": "random_forest.joblib",
    "gradient_boosting": "gradient_boosting.joblib",
}
FEATURE_COLUMNS = [
    "carat",
    "cut",
    "color",
    "clarity",
    "depth",
    "table",
    "x",
    "y",
    "z",
]

# Các model được nạp một lần khi ứng dụng khởi động và giữ trong RAM.
models: dict[str, object] = {}


@asynccontextmanager
async def lifespan(_app: FastAPI):
    """Nạp đủ bốn model trước khi AI Service nhận request."""
    logger.info("Bắt đầu load model")

    missing_files = [
        str(MODEL_DIRECTORY / file_name)
        for file_name in MODEL_FILES.values()
        if not (MODEL_DIRECTORY / file_name).is_file()
    ]
    if missing_files:
        message = "Thiếu file model bắt buộc: " + ", ".join(missing_files)
        logger.critical(message)
        raise RuntimeError(message)

    loaded_models: dict[str, object] = {}
    try:
        for model_name, file_name in MODEL_FILES.items():
            loaded_models[model_name] = joblib.load(MODEL_DIRECTORY / file_name)
            logger.info("Đã load %s", model_name)
    except Exception:
        logger.exception("Không thể load đầy đủ các model")
        raise

    models.update(loaded_models)
    logger.info("Đã load xong 4 model")
    logger.info("AI Service sẵn sàng")

    try:
        yield
    finally:
        models.clear()
        logger.info("Đã giải phóng model")


app = FastAPI(
    title="Diamond Price Prediction AI Service",
    version="1.0.0",
    lifespan=lifespan,
)


class DiamondInput(BaseModel):
    carat: float
    cut: str
    color: str
    clarity: str
    depth: float
    table: float
    x: float
    y: float
    z: float


def predict_price(model_name: str, diamond: DiamondInput) -> float:
    """Dự đoán bằng DataFrame có đúng schema mà pipeline đã dùng khi train."""
    input_frame = pd.DataFrame(
        [
            {
                "carat": diamond.carat,
                "cut": diamond.cut,
                "color": diamond.color,
                "clarity": diamond.clarity,
                "depth": diamond.depth,
                "table": diamond.table,
                "x": diamond.x,
                "y": diamond.y,
                "z": diamond.z,
            }
        ],
        columns=FEATURE_COLUMNS,
    )
    prediction = models[model_name].predict(input_frame)
    return float(prediction[0])


def prediction_response(
    model_name: str,
    diamond: DiamondInput,
    request: Request,
) -> dict[str, str | float]:
    predicted_price = round(predict_price(model_name, diamond), 2)
    request_id = request.state.request_id
    logger.info(
        "Dự đoán | request_id=%s | model=%s | predicted_price=%.2f",
        request_id,
        model_name,
        predicted_price,
    )
    return {
        "request_id": request_id,
        "model": model_name,
        "predicted_price": predicted_price,
    }


@app.middleware("http")
async def request_id_and_logging(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
    request.state.request_id = request_id
    response: Response

    try:
        response = await call_next(request)
    except Exception:
        logger.exception(
            "Request lỗi | request_id=%s | method=%s | path=%s | status_code=500",
            request_id,
            request.method,
            request.url.path,
        )
        raise

    response.headers["X-Request-ID"] = request_id
    logger.info(
        "Request | request_id=%s | method=%s | path=%s | status_code=%s",
        request_id,
        request.method,
        request.url.path,
        response.status_code,
    )
    return response


@app.get("/health")
def health(response: Response):
    loaded_count = len(models)
    if loaded_count != len(MODEL_FILES):
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return {
            "status": "not_ready",
            "service": "AI Service",
            "models_loaded": loaded_count,
        }

    return {
        "status": "ok",
        "service": "AI Service",
        "models_loaded": loaded_count,
    }


@app.get("/model-info")
def model_info():
    return {
        "dataset": "Diamonds",
        "target": "price",
        "models": list(MODEL_FILES.keys()),
        "model_count": len(models),
    }


@app.post("/predict")
def predict(
    diamond: DiamondInput,
    request: Request,
    model: str = "random_forest",
):
    if model not in MODEL_FILES:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "request_id": request.state.request_id,
                "error": (
                    f"Model '{model}' không tồn tại. "
                    f"Các model hợp lệ: {', '.join(MODEL_FILES)}"
                ),
            },
        )
    return prediction_response(model, diamond, request)


@app.post("/predict/linear-regression")
def predict_linear_regression(diamond: DiamondInput, request: Request):
    return prediction_response("linear_regression", diamond, request)


@app.post("/predict/decision-tree")
def predict_decision_tree(diamond: DiamondInput, request: Request):
    return prediction_response("decision_tree", diamond, request)


@app.post("/predict/random-forest")
def predict_random_forest(diamond: DiamondInput, request: Request):
    return prediction_response("random_forest", diamond, request)


@app.post("/predict/gradient-boosting")
def predict_gradient_boosting(diamond: DiamondInput, request: Request):
    return prediction_response("gradient_boosting", diamond, request)
