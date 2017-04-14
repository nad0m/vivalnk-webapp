
function Patch(uuid)
{
	var uuidRaw = uuid.split("-").join("");

	//this.battery = getBattery(hexBattery);

	this.serialNum = getSN(getCode(uuidRaw));

	
}

function getCode(uuid)
{
	return uuid.substring(2, 4) + uuid.substring(8, 12) + 
	uuid.substring(14, 16);
}

function getBattery(hexBattery)
{
	return parseInt(hexBattery, 16) * 1 + "%";
}

function getSN(hexSN)
{
	var SNBinary = dec2bin(parseInt(hexSN, 16));
	

	SNBinary = addZeros(SNBinary, 32);


	var SNWeek = getIntString(SNBinary, 6, 12);
	var SNUnique = getIntString(SNBinary, 12, 32);


	SNUnique = addZeros(SNUnique, 8);


	return "B" + SNWeek + "/" + SNUnique;
}

function getIntString (binValue, begin, end)
{
	return parseInt(binValue.substring(begin, end), 2).toString();
}

function dec2bin(dec)
{
    return (dec >>> 0).toString(2);
}

function addZeros(num, desiredLength)
{
	var difference = desiredLength - num.length;
	num = num.split("");

	for (var i = 0; i < difference; i++)
	{
		num.unshift("0");
	}

	return num.join("");
}

function randomString(size)
{
	var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < size; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var vv = new Patch("00001800-0000-1000-8000-00805f9b34fb");
var vv2 = new Patch("8f02010510ad4d25a0566976614c6e6b");
var arr = [];

debug("Serial: " + vv.serialNum);















