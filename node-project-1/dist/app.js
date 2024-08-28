"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
// parser
app.use(express_1.default.json());
app.use(express_1.default.text());
// router
const userRouter = express_1.default.Router();
app.use("/", userRouter);
userRouter.get('/api/v1/users/create-user', (req, res) => {
    const user = req.body;
    console.log(user);
    res.json({
        success: true,
        message: "user is created successfully",
        data: user
    });
});
const logger = (req, res, next) => {
    console.log(req.url, req.method, req.hostname);
    next();
};
// get all
app.get('/', logger, (req, res) => {
    // query params
    // http://localhost:3000?email=sarika@gmail.com&name=sarika
    console.log(req, req.query.name, req.query.email);
    res.send('Hello world!');
});
// get by id ( from params )
app.get('/:userId/:subId', logger, (req, res) => {
    // http://localhost:3000/56/72
    console.log(req.params.userId, req.params.subId);
    res.send('Hello world!');
});
// post data
app.post('/', logger, (req, res) => {
    // http://localhost:3000/
    console.log(req.body);
    // res.send('got data')
    res.json({
        message: "successfully received data"
    });
});
exports.default = app;
