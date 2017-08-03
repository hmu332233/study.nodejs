var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/* 스키마 정의 */
var userSchema = new Schema({
    //id는 기본으로 생성됨
    name: String
});

module.exports = mongoose.model("User", userSchema);