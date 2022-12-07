const config = {
    type: Phaser.AUTO,
    width: 750,
    height: 500,
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('bg', 'assets/background.png');
    this.load.image('block', 'assets/block.png');
    this.load.image('star', 'assets/star.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 24, frameHeight: 32 });
}

let blocks;
let stars;
let player;
let cursors;
let score = 0;
let scoreText;

function create() {
    this.add.image(375, 250, 'bg');

    const maze = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,3,0,0,0,0,0,0,3,0,0,0,0,3,1],
        [1,0,1,1,0,1,0,1,1,1,0,1,1,0,1],
        [1,0,1,3,0,1,3,0,0,1,0,3,1,0,1],
        [1,0,0,0,1,1,1,1,0,1,0,1,1,0,1],
        [1,0,0,0,0,1,0,2,0,0,0,0,0,0,1],
        [1,0,1,3,0,0,0,0,1,0,0,3,1,0,1],
        [1,0,1,1,1,1,0,1,1,0,1,1,1,0,1],
        [1,3,0,0,0,0,0,3,1,3,0,0,0,3,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    blocks = this.physics.add.staticGroup();
    stars = this.physics.add.group();

    for (let r in maze) {
        for (let c in maze[r]) {
            let tile = maze[r][c];

            let x = c * 50 + 25;
            let y = r * 50 + 25;

            if (tile === 1) {
                blocks.create(x, y, 'block');
            } else if (tile === 2) {
                player = this.physics.add.sprite(x, y, 'dude');
                player.setCollideWorldBounds(true);
                player.body.setAllowGravity(false);
            } else if (tile == 3) {
                stars.create(x, y, 'star');
            }
        }
    }

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 16, end: 23 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 0 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 24, end: 31 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('dude', { start: 8, end: 15 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('dude', { start: 1, end: 7 }),
        frameRate: 10,
        repeat: -1
    });

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '16px', fill: '#FFFF00' });

    cursors = this.input.keyboard.createCursorKeys();
    
    this.physics.add.collider(player, blocks);

    this.physics.add.overlap(player, stars, collectStars, null, this);
}

function update() {
    if (cursors.left.isDown && !cursors.right.isDown) {
        player.setVelocityX(-100);
        player.anims.play('left', true);
    } else if (cursors.right.isDown && !cursors.left.isDown) {
        player.setVelocityX(100);
        player.anims.play('right', true);
    } else if (cursors.up.isDown && !cursors.down.isDown) {
        player.setVelocityY(-100);
        player.anims.play('up', true);
    } else if (cursors.down.isDown && !cursors.up.isDown) {
        player.setVelocityY(100);
        player.anims.play('down', true);
    } else {
        player.setVelocityX(0);
        player.setVelocityY(0);
        player.anims.play('turn');
    }
}