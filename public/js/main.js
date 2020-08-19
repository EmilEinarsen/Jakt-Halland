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
const menu = new Menu()
const page = new Page()
const date = new Date()
const server = new Server()
let form = new Form()
let lazyload = new Lazyload()
let months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", 
"Juli", "Augusti", "September", "Oktober", "November", "December"]


document.addEventListener("DOMContentLoaded", () => {
	announce.events()
	lazyload.load()
	document.addEventListener("scroll", lazyload.load)
	window.addEventListener("resize", lazyload.load)
	window.addEventListener("orientationChange", lazyload.load)
	const inputs = [...queryTargetAll('input'), queryTarget('textarea')]
	inputs.map(input => input.addEventListener("focus", e => {
		page.toggleInputFocus(e)
	}))
	inputs.map(input => input.addEventListener("blur", e => {
		const id = targetId(e)
		page.toggleInputFocus(e)
		validate.isInputValid(e.target.value, id) ? page.inputSuccess(id): page.removeSuccess(id)
		page.resizeTextareaToFitContent(e)
	}))
})

document.addEventListener("click", e => { 
	const id = targetId(e) 

	parentId(e) === 'btnMenu' ? menu.toggleMenu() : menu.closeMenu()

	if(id === 'parallax-circle') scroll.scrollToParameter('.thumbnail-container')

	if(id === 'nav-1') scroll.scrollToTop()

	if(id === 'thumbnail-1' || id === 'nav-2' || id === 'btn-parallax-1') scroll.scrollToParameter('.article-1')

	if(id === 'thumbnail-2' || id === 'nav-3') scroll.scrollToParameter('.article-2')

	if(id === 'thumbnail-3' || id === 'nav-4') scroll.scrollToParameter('.article-3')

	if(id === 'nav-5' || id === 'btn-parallax-2') scroll.scrollToParameter('.form')

	if(id === 'icon') scroll.scrollToTop()

	if(id ==='article') page.toggleArticle(e)
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


function Scroll() {
	let y
	getPositionY = () => window.scrollY

	this.disableScroll = () => {
		y = getPositionY()
		page.setVerticlePositionOfBody(y)
		queryTarget('body').classList.add('stop-scrolling')
	}
	this.enableScroll = () => {
		if(!validate.isScrollingDisabled()) return
		page.removeVerticlePositionOfBody()
		queryTarget('body').classList.remove('stop-scrolling')
		this.scrollToInstantly({top: y})
	}

	this.keepYPosition = func => {
		y = getPositionY()
		func()
		this.scrollToInstantly({top: y})
	}

	this.scrollToParameter = (param) => {
		const yOffset = -120
		const y = queryTarget(param).getBoundingClientRect().top + window.pageYOffset + yOffset
		window.scrollTo({top: y, behavior: 'smooth'})
	}
	this.scrollToTop = () => window.scrollTo({top: 0, behavior: 'smooth'})
	this.scrollToBottom = () => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})
	this.scrollToInstantly = param => window.scrollTo(param)
}


function Menu() {
	this.toggleMenu = () => {
		queryTarget('.main-nav').classList.toggle('visible')
		if(validate.isWidthMobile()) 
			validate.isMenuVisible() ? scroll.disableScroll() : scroll.enableScroll()
		queryTarget('.navbar-toggle').classList.toggle('open')
	}
	this.closeMenu = () => {
		scroll.enableScroll()
		if(!validate.isMenuVisible()) return
		queryTarget('.main-nav').classList.remove('visible')
		queryTarget('.navbar-toggle').classList.remove('open')
	}
}


function Form() {
	const xhr = new XMLHttpRequest()
	this.requestMailing = e => {
		if(validate.isFormValid(e)) attemptDispatch()
	}
	attemptDispatch = () => {
		xhr.open(queryTarget("#form").method, queryTarget("#form").action)
		xhr.setRequestHeader("Accept", "application/json")
		xhr.onreadystatechange = () => {
			if (xhr.readyState !== XMLHttpRequest.DONE) return
			if(xhr.status === 200) announce.formSubmissionSuccess()
		}
		xhr.send(new FormData(queryTarget("#form")))
	}
	this.reset = () => {
		queryTarget("#form").reset()
		page.toggleInputFocus()
	}
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


function Announce() {
	this.events = async() => {
		const [intensive, leader] = tools.structureApprouchingEvents(await server.getEvents())
		page.addInnerOf('#navbarInfo', `Nästa kurstillfällen: Intensiv Jägarexamen, den ${intensive}. Jaktledarutbildning, den ${leader}.`)
		page.addInnerOf('#intensiveEventDates', `Nästa kurstillfälle är den ${intensive}.`)
		page.addInnerOf('#leadershipEventDates', `Nästa kurstillfälle är den ${leader}.`)
	}
	this.formSubmissionSuccess = () => {
		page.addButtonSuccess()
		form.reset()
		tools.throttle(function() {
			page.removeSuccess()
			page.resetTextareaHeight()
		}, 3000)
	}
}


function Lazyload() {
	let images = document.querySelectorAll(".lazy")
	loadImage = image => image.classList.remove("lazy")

	this.load = () => {
		tools.throttle(() => {
			if(!images.length) removeObserver()
			images = [...images].filter(image => validate.isInWindow(image) ? loadImage(image) : image)
		}, 17)
	}
	removeObserver = () => {
		document.removeEventListener("scroll", this.load)
		window.removeEventListener("resize", this.load)
		window.removeEventListener("orientationChange", this.load)
	}
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
		return Promise.resolve(sort.sortDataByEvent())
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

function Validate() {
	this.isWidthMobile = () => tools.getScreenWidth() < 880
	this.isInWindow = param => param.offsetTop < (window.innerHeight + window.pageYOffset)
	this.isFormAnnouncingSuccess = () => queryTarget('form').classList.contains('success')
	this.isFormAnnouncingError = () => queryTarget('form').classList.contains('error')
	this.isScrollingDisabled = () => queryTarget('body').classList.contains('stop-scrolling')
	this.isMenuVisible = () => queryTarget('.main-nav').classList.contains('visible')
	
	this.isEventInFuture = eventStart => {
		const comparedDates = tools.compareDates(
			tools.getDate(), 
			tools.dateStringIntoIntObject(eventStart)
		)
		return (comparedDates === (0 || -1) ) ? true : false
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
			const inputContent = queryTarget(`#${id}`).value.trim()
			if(this.isInputValid(inputContent, id)) errorMessages[id] = ''
			page.formFeedback({[id]: errorMessages[id]})
		} else {
			const input = e.target.elements
			const inputContent = { 
				name: input.name.value.trim(), 
				subject: input.subject.value.trim(), 
				email: input.email.value.trim(), 
				message: input.message.value.trim(),
				phone: input.phone.value.trim()
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
			if(!input.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)) return false
		}
		return input ? true : false
	}
}


function Tools() {
	let throttle

	this.getScreenWidth = () => screen.width

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
	this.structureApprouchingEvents = ([intensive, leader]) => [
		intensive.length === 1 ? tools.produceDateString(intensive[0]) 
			: `${tools.produceDateString(intensive[0])} och ${tools.produceDateString(intensive[1])}`,
		tools.produceDateString(leader[0])
	]
}