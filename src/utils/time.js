export function twoDigits(number){
    return (number >= 0 && number < 10)? ("0" + number) : number;
}

export function secondsToDuration(seconds){
    let min = Math.floor(seconds / 60);
    let sec = seconds % 60;

    return twoDigits(min) + ":" + twoDigits(sec);
}