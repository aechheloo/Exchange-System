function unauthorized(res) {
    res.set("WWW-Authenticate", 'Basic realm="Exchange Admin"');
    return res.status(401).send("Authentication required");
}

module.exports = function basicAuth(req, res, next) {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
        return res
            .status(503)
            .send("Thiếu ADMIN_USERNAME hoặc ADMIN_PASSWORD");
    }

    const header = req.headers.authorization || "";
    const [scheme, encoded] = header.split(" ");

    if (scheme !== "Basic" || !encoded) {
        return unauthorized(res);
    }

    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    const separator = decoded.indexOf(":");

    if (separator < 0) {
        return unauthorized(res);
    }

    const suppliedUsername = decoded.slice(0, separator);
    const suppliedPassword = decoded.slice(separator + 1);

    if (
        suppliedUsername !== username ||
        suppliedPassword !== password
    ) {
        return unauthorized(res);
    }

    next();
};
