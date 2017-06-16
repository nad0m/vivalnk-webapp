const TEMPERATURE_HEXSTRING_UNIT = 0.0625;

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

function getTemp(adData)
{
	return (parseInt(adData.substring(58, 62),16) ^ 0xffff) * TEMPERATURE_HEXSTRING_UNIT;
}


function getSN(scanResult)
{
	//var hexSN = scanResult.substring(20, 22) + scanResult.substring(26, 30) + scanResult.substring(32, 34);

	var hexSN = scanResult.substring(48, 56);

	var SNBinary = dec2bin(parseInt(hexSN, 16)^ 0xffffffff) ;
	

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

var vv = new Patch("0000180000001000800000805f9b34fb");
var vv2 = new Patch("8f02010510ad4d25a0566976614c6e6b");
var arr = [];

//debug("Serial: " + vv.serialNum);

console.log(getTemp("02010411076B6E4C61766956A0514D18640401008F09FFFDFBCF6FEE9BFE9A"));
console.log(getSN("02010411076B6E4C61766956A0514D18640401008F09FFFDFDEF6541EBFE92"));
console.log(getTemp("02010411076B6E4C61766956A0514D18640401008F09FFFDFDEF6541EBFEDE"));
  			                   //0000180000001000800000805f9b34fb
var str = "02010411076B6E4C61766956A0514D18640401008F09FFFDFDEF6541EBFEDE";


console.log(str.includes("0401008F"));



for ( var i = 0 ; i < 0; i++)
{

	console.log(i);
}








