const targetId = e => e.target.id
const parentId = e => e.target.parentElement.id
const queryTarget = param => document.querySelector(param)
const queryTargetAll = param => document.querySelectorAll(param)
const body = () => document.body
const tools = new Tools()
const validate = new Validate()
const announce = new Announce()
const sort = new Sort()
const scroll = new Scroll()
let menu
const page = new Page()
const date = new Date()
const server = new Server()
const form = new Form()
const lazyload = new Lazyload()
Array.prototype.contains = function(obj) { return this.indexOf(obj) > -1 }
const formInputs = [...queryTargetAll('input'), queryTarget('textarea')]

document.addEventListener("DOMContentLoaded", e => {
	tools.setDOMContentLoadedTimeStamp(e)
	menu = new Menu()
	menu.toggleNavbarTransparency()
	announce.events()
	lazyload.load()
})

document.addEventListener("click", e => { 
	const id = targetId(e)

	targetId(e) === 'btnMenu' ? menu.toggle() : menu.close()

	if(id === 'nav-1') scroll.scrollToTop()

	if(['thumbnail-1', 'nav-2', 'parallax-1'].contains(id)) scroll.scrollToParameter('.article-1')

	if(['thumbnail-2', 'nav-3'].contains(id)) scroll.scrollToParameter('.article-2')

	if(['thumbnail-3', 'nav-4'].contains(id)) scroll.scrollToParameter('.article-3')

	if(['nav-5', 'parallax-2'].contains(id)) scroll.scrollToParameter('.form')

	if(id === 'logo') scroll.scrollToTop()

	if(id === 'article') page.toggleArticle(e)

	tools.setLastClickTimeStamp(e)
})
queryTarget("#form").addEventListener("submit", e => {
	e.preventDefault()
	if(validate.isFormAnnouncingError()) return page.removeButtonError()
	if(validate.isFormAnnouncingSuccess()) {
		page.removeSuccess()
		page.resetTextareaHeight()
		tools.cancelThrottle()
	} else form.requestMailing(e)
})
queryTarget("#form").addEventListener("input", e => { 
	if(targetId(e) === "message") page.resizeTextareaToFitContent(e)
	validate.isFormValid(e) 
})
window.addEventListener("scroll", e => tools.throttle(function() {
		lazyload.load()
		tools.setLastScrollTimeStamp(e)
		if(scroll.getPositionY() >= 400) menu.toggleNavbarVisiblity(e)
		if(scroll.getPositionY() >= 10) menu.removeNavbarTransparent()
		if(!validate.isWidthMobile() ? scroll.getPositionY() < 50 : scroll.getPositionY() <= 10) {
			menu.addNavbarVisible()
			menu.toggleNavbarTransparency()
		}
	}, 20)
)
window.addEventListener("resize", () => {
	if(!validate.isWidthMobile()) tools.throttle(menu.close(), 20)
	menu.toggleNavbarTransparency()
	lazyload.load()
})
window.addEventListener("orientationChange", () => {
	menu.toggleNavbarTransparency()
	lazyload.load()
})
formInputs.map(input => input.addEventListener("focus", e => {
    page.removeButtonError()
    page.toggleInputFocus(e)
}))
formInputs.map(input => input.addEventListener("blur", e => {
	const id = targetId(e)
    if(!e.target.value) page.toggleInputFocus(e)
    validate.isInputValid(e.target.value, id) ? page.inputSuccess(id): page.removeSuccess(id)
	if(!e.target.value) page.resizeTextareaToFitContent
}))
function Announce() {
	this.events = async() => {
		const events = await server.getEvents()
		let [AbdIntensive, AbdLeader, AbdCalm] = tools.structureApprouchingEvents(events, true)
		let [intensive, leader, calm] = tools.structureApprouchingEvents(events)
		let eventsString = `Nästa kurstillfällen: `

		if(intensive) {
			page.addInnerOf('#intensiveEventDates', `Nästa kurstillfälle är den ${intensive}.<br><br>`)
			eventsString = `${eventsString} Intensiv Jägarexamen, den ${AbdIntensive}.`
		} else page.hideMe('#intensiveEventDates')
		
		if(calm) {
			page.addInnerOf('#calmEventDates', `Nästa kurstillfälle är den ${calm}.<br><br>`)
			eventsString = `${eventsString} Lugn Jägarexamen, den ${AbdCalm}.`
		} else page.hideMe('#calmEventDates')

		if(leader) {
			page.addInnerOf('#leadershipEventDates', `Nästa kurstillfälle är den ${leader}.<br><br>`)
			eventsString = `${eventsString} Jaktledarutbildning, den ${AbdLeader}.`
		} else page.hideMe('#leadershipEventDates')

		if(!(intensive && leader)) page.hideParent('#parallaxInfo')
		else page.addInnerOf('#parallaxInfo', eventsString)
	}
	this.formSubmissionSuccess = () => {
		page.addButtonSuccess()
		form.reset()
		tools.throttle(() => {
			page.removeSuccess()
			page.resetTextareaHeight()
		}, 3000)
	}
}
function Form() {
	const xhr = new XMLHttpRequest()
	const formDOM = queryTarget("#form")
	this.requestMailing = e => validate.isFormValid(e) ? attemptDispatch() : ''
	attemptDispatch = () => {
		xhr.open(formDOM.method, formDOM.action)
		xhr.setRequestHeader("Accept", "application/json")
		xhr.onreadystatechange = () => {
			if (xhr.readyState !== XMLHttpRequest.DONE) return
			if(xhr.status === 200) announce.formSubmissionSuccess()
		}
		xhr.send(new FormData(formDOM))
	}
	this.reset = () => {
		queryTarget("#form").reset()
		page.toggleInputFocus()
	}
}
function Lazyload() {
	let images = [...queryTargetAll('.lazy')]
	loadImage = image => image.classList.remove("lazy")

	this.load = () => {
		tools.throttle(() => {
			if(!images.length) removeObserver()
			images = images.filter(image => validate.isInWindow(image) ? loadImage(image) : image)
		}, 17)
	}
	removeObserver = () => {
		document.removeEventListener("scroll", this.load)
		window.removeEventListener("resize", this.load)
		window.removeEventListener("orientationChange", this.load)
	}
}
function Menu() {
	const navbar = queryTarget('nav')
	
	this.toggle = () => {
		navbar.classList.toggle('open')
		if(validate.isWidthMobile()) scroll.toggleScroll()
	}
	this.close = () => {
		scroll.enable()
		if(!validate.isMenuOpen()) return
		navbar.classList.remove('open')
	}
	this.toggleNavbarVisiblity = e => {
		if(!validate.shouldNavbarVisibiltyToggle(e)) return
		let isScrollingUp = scroll.direction()
		this.close()
		isScrollingUp ? this.addNavbarVisible() : this.removeNavbarVisible()
	}
	this.toggleNavbarTransparency = () => {
		tools.getScreenHeight() <= 750 && scroll.getPositionY() < 50 ? menu.removeNavbarTransparent() : menu.addNavbarTransparent()
	}
	this.addNavbarVisible = () => navbar.classList.add('visible')
	this.removeNavbarVisible = () => navbar.classList.remove('visible')
	this.addNavbarTransparent = () => navbar.classList.add('transparent')
	this.removeNavbarTransparent = () => navbar.classList.remove('transparent')
}

function Page() {
	this.removePreloader = () => {
		queryTarget('.loader_bg').classList.add('hidden')
	}
	this.setVerticlePositionOfBody = y => body().style.top = `-${y}`
	this.removeVerticlePositionOfBody = () => body().style.top = ''
	this.addInnerOf = (param, content) => {
		queryTarget(param).innerHTML = content
	}
	this.removeInnerOf = param => {
		queryTarget(param).innerHTML = ''
	}
	this.removeOuterOf = param => {
		queryTarget(param).outerHTML = ''
	}
	this.hideMe = param => queryTarget(param).style.display = 'none' 
	this.hideParent = param =>  queryTarget(param).parentElement.style.display = 'none' 
	this.toggleArticle = e => {
		e.target.nextElementSibling.classList.toggle("closed")
		e.target.children[0].classList.toggle("open")
	}
	
	this.resizeTextareaToFitContent = () => {
		if(validate.isWidthMobile()) return
		scroll.keepYPosition(resizeTextarea)
	}
	resizeTextarea = () => {
		this.resetTextareaHeight()
		setTextareaHeight(`${queryTarget('#message').scrollHeight}px`)
	}
	this.resetTextareaHeight = () => {
		if(!queryTarget('#message').value) setTextareaHeight('40px')
		else setTextareaHeight('')
	}
	setTextareaHeight = valueInPx => queryTarget('#message').style.height = valueInPx
	
	this.formFeedback = errorMessages => {
		for(let key in errorMessages)
			errorMessages[key] ? this.inputError(errorMessages[key], key) : this.inputSuccess(key)
	}
	this.inputSuccess = key => {
		removeInputError(key)
		queryTarget(`#${key}`).parentElement.classList.add('success')
	}
	this.removeSuccess = key => {
		if(!key) return [...queryTargetAll('.success')].map(e => e.classList.remove('success'))
		queryTarget(`#${key}`).parentElement.classList.remove('success')
	}
	this.inputError = (error, key) => {
		page.addInnerOf(`#${key}Feedback`, `<i class="fas fa-exclamation-circle"></i> ${error}`)
		this.removeSuccess(key)
		queryTarget(`#${key}`).parentElement.classList.add('error')
	}
	removeInputError = key => {
		page.addInnerOf(`#${key}Feedback`, ``)
		queryTarget(`#${key}`).parentElement.classList.remove('error')
	}
	this.addButtonSuccess = () => queryTarget('form').classList.add('success')
	this.addButtonError = () => queryTarget('form').classList.add('error')
	this.removeButtonError = () => queryTarget('form').classList.remove('error')
	this.toggleInputFocus = (e) => {
		if(!e) return [...queryTargetAll(".focus")].map(input => input.classList.remove("focus"))
		if(e.target.value) return
		removeInputError(targetId(e))
		e.target.parentElement.classList.toggle("focus")
	}
}

function Scroll() {
	let y
	let oldScroll
	this.setOldScroll = () => oldScroll = this.getPositionY()
	this.getPositionY = () => window.scrollY

	this.toggleScroll = () => {
		validate.isMenuOpen() ? this.disable() : this.enable()
	}
	this.disable = () => {
		y = this.getPositionY()
		page.setVerticlePositionOfBody(y)
		queryTarget('body').classList.add('stop-scrolling')
	}
	this.enable = () => {
		if(!validate.isScrollingDisabled()) return
		page.removeVerticlePositionOfBody()
		queryTarget('body').classList.remove('stop-scrolling')
		this.scrollToInstantly({top: y})
	}
	this.direction = () => {
		const scrollingUp = oldScroll > this.getPositionY()
		this.setOldScroll()
		return scrollingUp
	}

	this.keepYPosition = func => {
		y = this.getPositionY()
		func()
		this.scrollToInstantly({top: y})
	}

	this.scrollToParameter = (param) => {
		validate.setIsScrollingManual(false)
		const yOffset = -120
		let y = queryTarget(param).getBoundingClientRect().top + window.pageYOffset + yOffset
		window.scrollTo({top: y, behavior: 'smooth'})
	}
	this.scrollToTop = () => window.scrollTo({top: 0, behavior: 'smooth'})
	this.scrollToBottom = () => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})
	this.scrollToInstantly = param => window.scrollTo(param)
}
function Server() {
	this.data

	this.fetch = async () => {
		if(this.data) return
		try {
			const [events] = await Promise.all([
				(await fetch("https://wordpress.jakthalland.se/wp-json/wp/v2/events")).json(),
			])
			sort.sortData(events)
		} catch (err) {
			tools.throttle(this.fetch, 5000)
		  	console.log(err)
		}
	}
	this.getEvents = async() => {
		await this.fetch()
		return sort.sortDataByEvent()
	}
}
function Sort() {
	this.sortData = (events) => {
		server.data = {
			events: [...events].filter(event => validate.isEventInFuture(event.acf.startDate))
			.map(event => {
				return {
					event: event.acf.event,
					info: {
						text: event.acf.text,
						startDate: event.acf.startDate,
						endDate: event.acf.endDate,
					}
				}
			})
			.sort((eventA, eventB) => {
				return tools.compareDates(
					tools.dateStringIntoIntObject(eventA.info.startDate), 
					tools.dateStringIntoIntObject(eventB.info.startDate)
				)
			})
		}
	}
	this.sortDataByEvent = () => {
		return [...server.data.events].reduce(([intensive, leader, calm, weekend, other], event) => (
				event.event === "Jägarexamen (Intensiv)" ? [[...intensive, event], leader, calm, weekend, other]
					: event.event === "Jaktledarutbildning" ? [intensive, [...leader, event], calm, weekend, other]
						: event.event === "Jägarexamen (Lugn)" ? [intensive, leader, [...calm, event], weekend, other]
							: event.event === "Jakt helg" ? [intensive, leader, calm, [...weekend, event], other]
								: [intensive, leader, calm, weekend, [...other, event]]
			), [[], [], [], [], []]
		)
	}
}

function Tools() {
	let throttle
	const months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", 
	"Juli", "Augusti", "September", "Oktober", "November", "December"]
	const monthAbbriviations = ['jan', 'feb', 'mars', 'april', 'maj', 'juni', 'juli', 'aug', 'sep', 'okt', 'nov', 'dec']

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

	this.numberToMonth = (number, abbriviation) => abbriviation ? monthAbbriviations[number-1] : months[number-1]

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

	this.produceDateString = (event, abbriviation) => combineDatesBasedOnMonthAndDate(
		this.dateStringIntoIntObject(event.info.startDate),
		this.dateStringIntoIntObject(event.info.endDate), 
		abbriviation
	)

	combineDatesBasedOnMonthAndDate = (startDate, endDate, abbriviation) => {
		const startMonth = this.numberToMonth(startDate.month, abbriviation)
		if(startDate.month === endDate.month)
			return startDate.date === endDate.date ? `${startDate.date} ${startMonth}` 
			: `${startDate.date}-${endDate.date} ${startMonth}`
		else return `${startDate.date} ${startMonth}-${endDate.date} ${this.numberToMonth(endDate.month, abbriviation)}`
	}
	this.structureApprouchingEvents = ([intensive, leader, calm], abbriviation) => [
		intensive.length === 1 ? tools.produceDateString(intensive[0], abbriviation) 
			: `${tools.produceDateString(intensive[0])} och ${tools.produceDateString(intensive[1], abbriviation)}`,
		tools.produceDateString(leader[0], abbriviation),
		tools.produceDateString(calm[0], abbriviation)
	]
}

function Validate() {
	this.isWidthMobile = () => tools.getScreenWidth() < 1024
	this.isWidthMobile = () => tools.getScreenWidth() < 1024
	this.isInWindow = querytarget => querytarget.offsetTop < (window.innerHeight + window.pageYOffset)
	this.isFormAnnouncingSuccess = () => queryTarget('form').classList.contains('success')
	this.isFormAnnouncingError = () => queryTarget('form').classList.contains('error')
	this.isScrollingDisabled = () => queryTarget('body').classList.contains('stop-scrolling')
	this.isMenuOpen = () => queryTarget('nav').classList.contains('open')
	let isScrollingManual = true
	this.setIsScrollingManual = bool => isScrollingManual = bool

	this.shouldNavbarVisibiltyToggle = e => {
		if(isScrollingManual && e.timeStamp - tools.DOMContentLoadedTimeStamp > 1500 && tools.timeBetweenLastClickAndScroll()>40) return true
		scroll.setOldScroll()
		this.setIsScrollingManual(true)
	}
	
	this.isEventInFuture = eventStart => {
		const comparedDates = tools.compareDates(
			tools.getDate(), 
			tools.dateStringIntoIntObject(eventStart)
		)
		return (comparedDates === 0 || comparedDates === -1) ? true : false
	}
	this.isFormValid = e => {
		let errorMessages = {
			name: `För- och efternamn`, 
			subject: ``, 
			email: `Måste innehålla "@" och "."`, 
			message: `Du saknar ett meddelande`,
			phone: `Ogiltigt telefonmnummer`
		}
		if(e.type !== 'submit') {
			id = targetId(e)
			const inputContent = e.target.value.trim()
			if(this.isInputValid(inputContent, id)) errorMessages[id] = ''
			page.formFeedback({[id]: errorMessages[id]})
		} else {
			const el = e.target.elements
			const inputContent = { 
				name: el.name.value.trim(), 
				subject: el.subject.value.trim(), 
				email: el.email.value.trim(), 
				message: el.message.value.trim(),
				phone: el.phone.value.trim()
			}
			for(let key in inputContent) {
				if(this.isInputValid(inputContent[key], key)) errorMessages[key] = ''
				page.formFeedback({[key]: errorMessages[key]})
			}
			for(let key in inputContent)
				if(errorMessages[key]) {
					page.addButtonError()
					tools.throttle(page.removeButtonError, 3000)
					return false
				}
			return true
		}
	}
	this.isInputValid = (input, id) => {
		if(id === 'name')
			if(input.split(' ').length < 2) return false
		if(id === 'subject')
			if(!input) return true
		if(id === 'email') {
			if(input.split('@').length !== 2) return false
			if(input.split('.').length !== 2 || !input.split('.')[1]) return false
			if(input.split(/(\W)/).length !== 5) return false
		}
		if(id === 'phone') {
			if(input === '') return true
			if(!(
				input.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/) 
				|| input.match(/^\(?[+]?([0-9]{4})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
			)) return false
		}
		return input ? true : false
	}
}