//Promise 선언
var _promise = function (param) {
  return new Promise(function (resolve, reject){
    
    //비동기를 표현하기 위해 setTime 함수를 사용
    setTimeout(function() {
      
      //파라미터가 참이면
      if(param) {
        //해결됨
        resolve('해결 완료');
      } else {
        //실패
        reject(Error('실패!'));
      }
    },1000);
  });
};

//Promise 실행
_promise(true)
  .then(function (text){
    //성공시
    console.log(text);
  }, function (error){
    //실패시
    console.error(error);
  });