function collectStars(player, star) {
    star.disableBody(true, true);

    // Update score
    score += 10;
    scoreText.setText('Score: ' + score);
}