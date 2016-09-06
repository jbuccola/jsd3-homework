
$('body').prepend('<ul>')
$('body').prepend('<h1>99 Bottles of Beer on the Wall</h1>')


var $listNode = $('ul').first()
var textLine = ''

for (var i=99;i > -1; --i) {
    beersLeft = i - 1;
    $listNode.append('<li>')
    $listLine = $('li').last()
    if (i > 1) {
        textLine = i + " Bottles of beer on the wall, " + i + " bottles of beer.\n Take one down and pass it around, " + beersLeft + " bottles of beer on the wall.";
    }
    else if (i === 1) {
        textLine = i + " Bottle of beer on the wall, " + i + " bottle of beer.\n Take one down and pass it around, no more bottles of beer on the wall.";
    }
    else if (i === 0) {
        textLine = "No more bottles of beer on the wall, no more bottles of beer.\n go to the store and buy some more, no more bottles of beer on the wall.";
    }
    $listLine.text(textLine)
} 