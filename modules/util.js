export { num_str, whole_num_str };

function num_str(num) {
    return Math.round(num * 100) / 100;
}

function whole_num_str(num) {
    return Math.floor(num);
}