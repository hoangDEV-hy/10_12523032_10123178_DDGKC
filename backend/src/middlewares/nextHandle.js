

function errorHandler(error, req, res, _next) {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({
            message: 'JSON không hợp lệ',
            request_id: req.requestId
        });
    }

    console.error(
        `request_id=${req.requestId} | lỗi không xử lý được | type=${error.name || 'Error'}`
    );
    res.status(500).json({
        message: 'Đã xảy ra lỗi server',
        request_id: req.requestId
    });
}

