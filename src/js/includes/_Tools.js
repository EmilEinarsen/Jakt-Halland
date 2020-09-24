
function Tools() {
	let throttle
	const months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", 
	"Juli", "Augusti", "September", "Oktober", "November", "December"]

	this.lastClickTimeStamp = 0
	this.lastScrollTimeStamp = 0
	this.DOMContentLoadedTimeStamp
	this.setDOMContentLoadedTimeStamp = e => this.DOMContentLoadedTimeStamp = e.timeStamp
	this.setLastClickTimeStamp = e => this.lastClickTimeStamp = e.timeStamp
	this.setLastScrollTimeStamp = e => this.lastScrollTimeStamp = e.timeStamp
	this.timeBetweenLastClickAndScroll = () => this.lastScrollTimeStamp - this.lastClickTimeStamp
	this.getScreenWidth = () => screen.width
	this.getScreenHeight = () => screen.height

	this.throttle = (func, ms) => {
		this.cancelThrottle()
		throttle = setTimeout(() => func(), ms)
	}
	this.cancelThrottle = () => throttle ? clearTimeout(throttle) : ''

	this.numberToMonth = number => months[number-1]

	this.dateStringIntoIntObject = string => {
		dateArr = string.split("/")
		return {
			date: this.stringToInt(dateArr[0]),
			month: this.stringToInt(dateArr[1]),
			year: this.stringToInt(dateArr[2]),
		}
	}

	this.getDate = () => {
		return {
			date: date.getDate(),
			month: date.getMonth() + 1,
			year: date.getFullYear(),
		}
	}

	this.stringToInt = string => parseInt(string)

	this.compareDates = (dateA, dateB) => {
		const scoreOfDate = (dateA.year*365 + dateA.month * 31 + dateA.date) - (dateB.year*365 + dateB.month * 31 + dateB.date)
		return scoreOfDate === 0 ? 0 : scoreOfDate < 0 ? -1 : 1
		// 0 = now, -1 = future, 1 = past
	}

	this.produceDateString = event => {
		return combineDatesBasedOnMonthAndDate(
			this.dateStringIntoIntObject(event.info.startDate),
			this.dateStringIntoIntObject(event.info.endDate)
		)
	}
	combineDatesBasedOnMonthAndDate = (startDate, endDate) => {
		const startMonth = this.numberToMonth(startDate.month)
		if(startDate.month === endDate.month)
			return startDate.date === endDate.date ? `${startDate.date} ${startMonth}` 
			: `${startDate.date}-${endDate.date} ${startMonth}`
		else return `${startDate.date} ${startMonth}-${endDate.date} ${this.numberToMonth(endDate.month)}`
	}
	this.structureApprouchingEvents = ([intensive, leader, calm]) => [
		intensive.length === 0 ? ''
			: intensive.length === 1 ? tools.produceDateString(intensive[0]) 
			: `${tools.produceDateString(intensive[0])} och ${tools.produceDateString(intensive[1])}`,
		tools.produceDateString(leader[0]),
		tools.produceDateString(calm[0])
	]
}