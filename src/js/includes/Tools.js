import {} from './helpers'

let months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", 
"Juli", "Augusti", "September", "Oktober", "November", "December"]

export default function Tools() {
	let throttle

	this.throttle = func => {
		if(throttle) clearTimeout(throttle)
		throttle = setTimeout(() => func(), 17)
	}

	this.turnNumberIntoMonth = number => {
		return months[number-1]
	}

	this.turnDateStringIntoIntObject = string => {
		const arrray = string.split("/")
		return {
			date: this.stringToInt(arrray[0]),
			month: this.stringToInt(arrray[1]),
			year: this.stringToInt(arrray[2]),
		}
	}

	this.stringToInt = string => parseInt(string)

	this.produceDateString = event => {
		const startDate = this.turnDateStringIntoIntObject(event.info.startDate)
		const endDate = this.turnDateStringIntoIntObject(event.info.endDate)
		if(startDate.month === endDate.month)
			if(startDate.date === endDate.date) return `${startDate.date} ${this.turnNumberIntoMonth(startDate.month)}` 
			else return `${startDate.date}-${endDate.date} ${this.turnNumberIntoMonth(startDate.month)}`
		else return `${startDate.date} ${this.turnNumberIntoMonth(startDate.month)} -${endDate.date} ${this.turnNumberIntoMonth(endDate.month)}`
	}

	this.compareDates = (dateA, dateB) => {
		const scoreOfDate = (dateA.year*365 + dateA.month * 31 + dateA.date) - (dateB.year*365 + dateB.month * 31 + dateB.date)
		return scoreOfDate === 0 ? 0 : scoreOfDate < 0 ? -1 : 1 
		// 0 = now, -1 = future, 1 = past
	}
}