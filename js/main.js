enchant();

/**グローバル変数**/
var game;
var pad;
var player, bullet, enemy;
var rock1, rock2, field1, field2;
var spriteList = [];
var isPushA = false;
var score = 0;
/**グローバル変数**/

/**配列を削除するメソッド**/
Array.prototype.remove = function (elm) {
    var index = this.indexOf(elm);
    this.splice(index, 1);
    return this;
}
/**配列を削除するメソッド**/


/**webページが読み込まれたら呼び出す**/
addEventListener('load', function () {

    game = new Game(320, 320); //ゲームオブジェクトの作成
    game.preload('./img/chara1.png', './img/sky.png', './img/rock.png', './img/field.png', './img/bullet.png');

    //ゲームオブジェクトが読み込まれたら
    game.addEventListener('load', function () {
        game.pushScene(game.startScene()); //シーンをゲームに追加する 
    });

    //Zキー入力をaボタンとする
    game.keybind('Z'.charCodeAt(0), 'a');

    //**メインシーン
    game.mainScene = function () {
        var scene = new Scene(); //シーンを作成
        scene.backgroundColor = 'black'; //シーンを黒く塗りつぶす

        /*********オブジェクトの作成********/

        /**背景の作成**/
        bg(scene);

        /**HPラベルを作成**/
        var hpLabel = new Label();
        hpLabel.font = "32px 'Russo One', sans-seerif"; //フォントの設定

        /**得点ラベルを作成**/
        var scoreLabel = new Label();
        scoreLabel.font = "32px 'Russo One', sans-seerif"; //フォントの設定

        /**プレイヤーの作成**/
        player = new Player();
        spriteList.push(player); //spriteListにプッシュ

        /*********オブジェクトの作成********/

        var hitABullet = function hitABullet() {
            //弾を作成
            bullet = new Bullet();
            spriteList.push(bullet);
            isPushA = true;
        }


        /**シーン更新ごとに呼び出す**/
        scene.onenterframe = function () {

            //15フレーム毎に敵を生成する
            if (game.frame % 15 === 0) {
                /**敵キャラの作成**/
                enemy = new Enemy();
                spriteList.push(enemy); //spriteListにプッシュ
            }

            /**aボタンが押された瞬間のみ弾を撃つ**/
            if (isPushA === false) scene.addEventListener('abuttondown', hitABullet)
            else scene.removeEventListener('abuttondown', hitABullet);
            scene.addEventListener('abuttonup', function () {
                isPushA = false;
            });

            //スプライトの足の位置でソート
            spriteList.sort(function (_spriteA, _spriteB) {
                if (_spriteA.y + _spriteA.height > _spriteB.y + _spriteB.height) return 1;
                if (_spriteA.y + _spriteA.height < _spriteB.y + _spriteB.height) return 0;
            });

            /************スプライトの表示************/
            for (var i = 0; i < spriteList.length; ++i) {
                scene.addChild(spriteList[i]);
            }

            /*プレイヤーのHPを表示**/
            hpLabel.text = 'HP：' + player.hp;
            scene.addChild(hpLabel);

            /*スコアを表示*/
            scoreLabel.text = 'SCORE：' + score;
            scoreLabel.y = 30;
            scene.addChild(scoreLabel);
            /************スプライトの表示************/

            /*プレイヤーのHPが0ならばシーンを切り替える**/
            if (player.hp === 0) game.replaceScene(game.gameOverScene());
        }
        return scene;
    }

    /**ゲームオーバーシーン**/
    game.gameOverScene = function () {
        /**ゲームオーバーを表示**/
        var scene = new Scene();
        scene.backgroundColor = 'black';
        var gameOverLabel = new Label('GAME OVER');
        gameOverLabel.color = 'red';
        gameOverLabel.font = "32px 'Russo One', sans-seerif";
        gameOverLabel.moveTo(60, 150); //ラベルの位置
        scene.addChild(gameOverLabel);

        /**ゲームの再スタート**/
        scene.addEventListener('abuttondown', returnGame);
        scene.addEventListener('touchstart', returnGame);

        function returnGame() {
            init();
            game.replaceScene(game.mainScene());
            game.removeEventListener('abuttondown', returnGame);
        }

        /**スコアを表示**/
        var gameOverScoreLabel = new Label();
        gameOverScoreLabel.text = 'SCORE：' + score;
        gameOverScoreLabel.color = 'white';
        gameOverScoreLabel.font = "16px 'Russo One', sans-serif";
        gameOverScoreLabel.moveTo(180, 250); //ラベルの位置
        scene.addChild(gameOverScoreLabel);

        return scene;
    }

    /**スタート（タイトル）シーン**/
    game.startScene = function () {
        var scene = new Scene(); //シーンを作成
        scene.backgroundColor = 'black'; //シーンを黒く塗りつぶす
        var titleLabel = new Label('Snipe at Mons'); //タイトルのラベルを作成
        titleLabel.color = 'white';
        titleLabel.font = "32px 'Russo One', sans-serif"; //フォントの設定
        titleLabel.moveTo(50, 120); //ラベルの位置
        scene.addChild(titleLabel);

        var descriptionLabel = new Label('Tap or press Z');
        descriptionLabel.color = "red";
        descriptionLabel.font = "16px 'Russo One', sans-serif";
        descriptionLabel.moveTo(105, 200);
        scene.addChild(descriptionLabel); //ラベルをsceneに追加

        /**aボタンかタップでメインゲームに進む**/
        scene.addEventListener('abuttondown', goToTheGame);
        scene.addEventListener('touchstart', goToTheGame);

        function goToTheGame() {
            game.replaceScene(game.mainScene());
            game.removeEventListener('abuttondown', goToTheGame);
        }
        return scene;
    }
    game.start(); //ゲームスタート
});
/**webページが読み込まれたら呼び出す**/


/**プレイヤーのクラス**/
var Player = Class.create(Sprite, {
    //ここにプレイヤーの処理
    initialize: function () {
        //ここに処理を初期化
        this.hp = 2;
        Sprite.call(this, 32, 32); // Spriteクラスのメソッドをthisでも使えるようにする
        this.image = game.assets['./img/chara1.png'];
        this.frame = 0;
        this.moveTo(60, 180); //プレイヤーの初期位置
        this.unrivaledTime = 0; //プレイヤーの無敵時間

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
                score += 5; //進めば進むほどスコアが加算される
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

        /**プレイヤーと敵の当たり判定**/
        if (this.unrivaledTime === 0) {
            for (var i = 0; i < spriteList.length; i++) {
                var sprite = spriteList[i];
                if (sprite === this) continue;
                if (sprite === bullet) continue;
                if (this.within(sprite, 20)) {
                    this.moveTo(60, 180);
                    this.hp--; //プレイヤーのHPから1ずつ引いていく
                    this.unrivaledTime = 30; //無敵時間
                }
            }
        } else {
            this.unrivaledTime--;
            //this.opacity = this.unrivaledTime % 3;
        }
    }
});

/**敵キャラのクラス**/
var Enemy = Class.create(Sprite, {
    initialize: function () {
        this.existance = 1;
        Sprite.call(this, 32, 32); //spriteクラスのメソッドをthisでも使えるようにする
        this.image = game.assets['./img/chara1.png']; //spriteの画像ファイルを指定
        var rnd = Math.random() * (170);
        this.frame = 5;
        this.moveTo(330, 100 + rnd); //敵キャラのの初期位置
    },
    onenterframe: function () {
        this.x -= 3; //敵キャラの移動

        /**敵キャラのx座標が-30以下になったら削除**/
        if (this.x < -30 || this.existance === 0) {
            this.parentNode.removeChild(this);
            spriteList.remove(this);
        }

    }
});

/**背景に関する設定**/
var bg = function (scene) {

    //空のスプライトを表示
    var sky = new Sprite(320, 320);
    sky.image = game.assets['./img/sky.png'];
    scene.addChild(sky);

    //岩のスプライトを表示
    rock1 = new Sprite(320, 320);
    rock1.image = game.assets['./img/rock.png'];
    rock2 = new Sprite(320, 320);
    rock2.image = game.assets['./img/rock.png'];
    rock2.x = 320;
    scene.addChild(rock1);
    scene.addChild(rock2);

    //地面のスプライト
    field1 = new Sprite(320, 320);
    field1.image = game.assets['./img/field.png'];
    field2 = new Sprite(320, 320);
    field2.image = game.assets['./img/field.png'];
    field2.x = 320;
    scene.addChild(field1);
    scene.addChild(field2);
}

/**弾のクラス**/
var Bullet = Class.create(Sprite, {
    initialize: function () {
        var bulletX, bulletY; //弾のx座標とY座標
        Sprite.call(this, 6, 2);
        this.image = game.assets['./img/bullet.png']; //スプライトの画像ファイル指定
        //プレイヤーの向きによって弾の位置や動かす方向を変える
        if (player.scaleX >= 0) {
            this.speed = 20;
            bulletX = player.x + 50;
        } else {
            this.speed = -20;
            bulletX = player.x - 5;
        }
        bulletY = player.y + 19;
        this.moveTo(bulletX, bulletY); //弾の位置
    },

    onenterframe: function () {
        this.x += this.speed; //弾の移動
        /**弾が画面の外に出たら削除**/
        if (this.x < -10 || this.x > 330 || this.existance === 0) {
            this.parentNode.removeChild(this);
            spriteList.remove(this);
        }
        /**弾と敵との当たり判定**/
        for (var i = 0; i < spriteList.length; i++) {
            var sprite = spriteList[i];
            if (sprite === player) continue;
            if (sprite === this) continue;
            if (this.intersect(sprite)) {
                sprite.existance = 0;
                this.existance = 0;
                score += 200; //scoreに200を加算
            }
        }
    }
});

//変数の初期化
var init = function () {
    score = 0;
    player.hp = 2;
    spriteList = [];
}
