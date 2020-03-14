/**プレイヤーのクラス**/
var Player = Class.create(Sprite, {
    //ここにプレイヤーの処理
    initialize: function () {
        //ここに処理を初期化
        Sprite.call(this, 32, 32); // Spriteクラスのメソッドをthisでも使えるようにする
        this.image = game.assets['./img/chara1.png'];
        this.frame = 0;
        this.moveTo(60, 180); //プレイヤーの初期位置
    },
    onenterframe: function () {
        //毎フレームごとの処理
        var speed = 14; //プレイヤーの速度

        //キー入力があったときのプレイヤーの移動
        if (game.input.left) {
            this.x -= speed;
            this.frame = this.age % 13 + 11;
        }
        if (game.input.right) {
            this.x += speed;
            this.frame = this.age % 13 + 11;
            //プレイヤーのx座標が、半分の位置より大きいとき
            if (this.x > 160 - this.width / 2) {
                // デバッグ用
                //console.log(this.width / 2);
                this.x = 160 - this.width / 2;
                field1.x -= speed; //地面をスクロール
                field2.x -= speed; //地面をスクロール
                if (field1.x <= -320) field1.x = field2.x + 320;
                if (field2.x <= -320) field2.x = field1.x + 320;
                rock1.x -= speed / 2; //地面をスクロール
                rock2.x -= speed / 2; //地面をスクロール
                if (rock1.x <= -320) rock1.x = rock2.x + 320;
                if (rock2.x <= -320) rock2.x = rock1.x + 320;
                //敵キャラのスクロール
                for (var i = 0; i < spriteList.length; i++) {
                    var sprite = spriteList[i];
                    if (sprite === this) continue;
                    sprite.x -= speed;
                }
            } else this.x += speed;
        }
        if (game.input.up) {
            this.y -= speed;
            this.frame = this.age % 13 + 11;
        }
        if (game.input.down) {
            this.y += speed;
            this.frame = this.age % 13 + 11;
        }

        /**移動範囲の設定**/
        if (this.x < 0) this.x = 0; //左からはみ出ない
        if (this.y < 100) this.y = 100; //下範囲上限
        if (this.y > 260) this.y = 260; //上範囲上限
    }
});
