// --------CUT-THEN-COMPARE------------------------------------------------ //
export const cutThenCompare = (
	str1: string,
	str2: string,
	str1Spliter: string,
	str1Index: number,
	str2Spliter: string = str1Spliter,
	str2Index: number = str1Index
) => {
	const finalStr1 = str1.split(str1Spliter)[str1Index]
	const finalStr2 = str2.split(str2Spliter)[str2Index]
	return finalStr1 === finalStr2
}