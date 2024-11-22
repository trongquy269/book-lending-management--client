export default function canConvertToNumber(str) {
	if (+str === NaN) {
		return false;
	}

	return true;
}
