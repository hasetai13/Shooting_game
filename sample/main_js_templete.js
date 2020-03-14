/*

このコードはenchant.jsでゲームを開発する際の雛形です。



*/




//おまじない
enchant();

//変数宣言
var game;

//Webページが読み込まれたら
addEventListener('load', function () {
    game = new Game(320, 320); //ゲームオブジェクトの作成

    //ゲームオブジェクトが読み込まれたら
    game.addEventListener('load', function () {
        //ここにメインの処理を作っていく
    });
    game.start(); //ゲームスタート
});
