const targetId = e => e.target.id
const parentId = e => e.target.parentElement.id
const queryTarget = param => document.querySelector(param)
const queryTargetAll = param => document.querySelectorAll(param)
const body = () => document.body
const tools = new Tools()
const scroll = new Scroll()
const menu = new Menu()
const page = new Page()
const date = new Date()
const server = new Server()
let form
let lazyload
let months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", 
"Juli", "Augusti", "September", "Oktober", "November", "December"]


document.addEventListener("DOMContentLoaded", () => {
	form = new Form()
	lazyload = new Lazyload()
	page.announceApproachingEvents()
	document.addEventListener("scroll", lazyload.lazyload)
	window.addEventListener("resize", lazyload.lazyload)
	window.addEventListener("orientationChange", lazyload.lazyload)
	const inputs = [...queryTargetAll('input'), queryTarget('textarea')]
	inputs.map(input => input.addEventListener("focus", e => form.toggleInputFocus(e)))
	inputs.map(input => input.addEventListener("blur", e => {
		form.toggleInputFocus(e)
		form.removeClassSuccessIfInputEmpty(e)
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
	form.requestMailing(e)
})
queryTarget("#form").addEventListener("input", e => { if(targetId(e) === "message") page.resizeTextareaToFitContent(e); form.validate(e) })


function Scroll() {
	this.disableScroll = () => {
		page.addPositionYToBody()
		queryTarget('body').classList.add('stop-scrolling')
	}

	this.enableScroll = () => {
		if(!isScrollingDisabled()) return
		queryTarget('body').classList.remove('stop-scrolling')
		this.scrollToInstantly({top: tools.stringToInt(body().style.top) * -1})
		page.removePositionYFromBody()
	}

	this.scrollToParameter = (param) => {
		const yOffset = -120
		const y = queryTarget(param).getBoundingClientRect().top + window.pageYOffset + yOffset
		window.scrollTo({top: y, behavior: 'smooth'})
	}

	
	this.scrollToTop = () => window.scrollTo({top: 0, behavior: 'smooth'})
	this.scrollToBottom = () => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})
	this.scrollToInstantly = param => window.scrollTo(param)
	isScrollingDisabled = () => queryTarget('body').classList.contains('stop-scrolling')
}


function Menu() {
	isMenuVisible = () => queryTarget('.main-nav').classList.contains('visible')
	
	this.closeMenu = () => {
		scroll.enableScroll()
		if(!isMenuVisible()) return
		hideMenu()
		resetMenuButton()
	}
	this.toggleMenu = () => {
		toggleMenuVisibilty()
		if(tools.isWidthMobile()) toggleScroll()
		toggleMenuButton()
	}
	
	toggleMenuVisibilty = () => queryTarget('.main-nav').classList.toggle('visible')
	hideMenu = () => queryTarget('.main-nav').classList.remove('visible')

	toggleMenuButton = () => queryTarget('.navbar-toggle').classList.toggle('open')
	resetMenuButton = () => queryTarget('.navbar-toggle').classList.remove('open')
	
	toggleScroll = () => {
		if(isMenuVisible()) scroll.disableScroll()
		else scroll.enableScroll()
	}
}


function Form() {
	const xhr = new XMLHttpRequest()

	this.requestMailing = e => {
		if(this.validate(e)) attemptDispatch()
	}
	attemptDispatch = () => {
		xhr.open(queryTarget("#form").method, queryTarget("#form").action)
		xhr.setRequestHeader("Accept", "application/json")
		xhr.onreadystatechange = () => {
			if (xhr.readyState !== XMLHttpRequest.DONE) return
			if(xhr.status === 200) success()
		}
		xhr.send(fetchContent())
	}
	this.validate = e => {
		let errorMessages = {
			name: `För- och efternamn`, 
			subject: ``, 
			email: `Måste innehålla "@" och "."`, 
			message: `Du saknar ett meddelande`,
			phone: `Inte ett giltigt telefonmnummer`
		}
		if(e.type !== 'submit') {
			id = targetId(e)
			const inputContent = queryTarget(`#${id}`).value.trim()
			if(this.isInputValid(inputContent, id)) errorMessages[id] = ''
			displayFeedback({[id]: errorMessages[id]})
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
				displayFeedback({[key]: errorMessages[key]})
			}
			for(let key in inputContent)
				if(errorMessages[key] !== '') { return false }
			
			return true
		}
	}
	this.isInputValid = (input, id) => {
		if(id === 'name')
			if(input.split(' ').length < 2) return false
		if(id === 'subject')
			if(input === '') return true
		if(id === 'email') {
			if(input.split('@').length !== 2) return false
			if(input.split('.').length !== 2 || input.split('.')[1] === '') return false
			if(input.split(/(\W)/).length !== 5) return false
		}
		if(id === 'phone') {
			if(input === '') return true
			if(!input.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)) return false
		}
		return input !== '' ? true : false
	}
	fetchContent = () => new FormData(queryTarget("#form"))
	success = () => {
		addButtonSuccess()
		resetForm()
		tools.throttle(function () {
			removeInputSuccess()
			page.resetTextareaHeight()
			removeButtonSuccess()
		}, 3000)
	}
	displayFeedback = errorMessages => {
		for(let key in errorMessages) {
			errorMessages[key] !== '' ? displayInputError(errorMessages[key], key) : displayInputSuccess(key)
		}
	}
	this.toggleInputFocus = (e) => {
		if(!e) { [...queryTargetAll(".focus")].map(input => input.classList.remove("focus")); return}
		if(e.target.value) return
		removeInputError(targetId(e))
		e.target.parentElement.classList.toggle("focus")
	}
	this.removeClassSuccessIfInputEmpty = e => {
		if(e.target.value) return
		e.target.classList.remove('success')
	}
	displayInputSuccess = key => {
		removeInputError(key)
		queryTarget(`#${key}`).parentElement.classList.add('success')
	}
	addButtonSuccess = () => queryTarget('form').parentElement.classList.add('success')
	removeButtonSuccess = () => queryTarget('form').parentElement.classList.remove('success')
	displayInputError = (error, key) => {
		page.addInnerOf(`#${key}Feedback`, `<i class="fas fa-exclamation-circle"></i> ${error}`)
		removeInputSuccess(key)
		queryTarget(`#${key}`).parentElement.classList.add('error')
	}
	removeInputSuccess = key => {
		if(!key) return [...queryTargetAll('.success')].map(e => e.classList.remove('success'))
		queryTarget(`#${key}`).parentElement.classList.remove('success')
	}
	removeInputError = key => {
		page.addInnerOf(`#${key}Feedback`, ``)
		queryTarget(`#${key}`).parentElement.classList.remove('error')
	}
	resetForm = () => {
		queryTarget("#form").reset()
		this.toggleInputFocus()
	}
}


function Page() {
	this.removePreloader = () => {
		queryTarget('.loader_bg').classList.add('hidden')
		/* setTimeout(() => this.removeOuterOf('.loader_bg'), 500) */
	}
	this.addPositionYToBody = () => body().style.top = `-${window.scrollY}`
	this.removePositionYFromBody = () => body().style.top = ''
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
		const keepPositionYOnResize = () => {
			this.addPositionYToBody()
			resizeTextarea()
			scroll.scrollToInstantly({top: tools.stringToInt(body().style.top) * -1})
			this.removePositionYFromBody()
		}
		const resizeTextarea = () => {
			this.resetTextareaHeight()
			setTextareaHeight(`${queryTarget('#message').scrollHeight}px`)
		}
		if(!tools.isWidthMobile()) tools.throttle(keepPositionYOnResize, 17)
	}
	this.resetTextareaHeight = () => {
		if(!queryTarget('#message').value) setTextareaHeight('40px')
		else setTextareaHeight('')
	}
	this.announceApproachingEvents = () => {
		server.fetch().then(()=>{
			let [hunter, leader] = server.getEventsByEvent()
			hunter = ifNeededConcatDateStrings(hunter)
			leader = tools.produceDateString(leader[0])
			this.addInnerOf('#navbarInfo', `Nästa kurstillfällen: Intensiv Jägarexamen, den ${hunter}. Jaktledarutbildning, den ${leader}.`)
			this.addInnerOf('#intensiveEventDates', `Nästa kurstillfälle är den ${hunter}.`)
			this.addInnerOf('#leadershipEventDates', `Nästa kurstillfälle är den ${leader}.`)
		})
		const ifNeededConcatDateStrings = events => {
			if(events.length === 1) return tools.produceDateString(events[0])
			return `${tools.produceDateString(events[0])} och ${tools.produceDateString(events[1])}`
		}
	}
	setTextareaHeight = valueInPx => queryTarget('#message').style.height = valueInPx
}


function Lazyload() {
	let images = document.querySelectorAll(".lazy")
	loadImage = image => image.classList.remove("lazy")
	isImagesLoaded = () => images.length === 0

	this.lazyload = () => {
		tools.throttle(load, 17)
	}
	load = () => {
		images = [...images].filter(image => {
			console.log(image,tools.isInWindow(image),image.offsetTop)
			if(tools.isInWindow(image)) loadImage(image)
			else return image
		})
		if(isImagesLoaded()) removeObserver()
	}
	removeObserver = () => {
		document.removeEventListener("scroll", this.lazyload)
		window.removeEventListener("resize", this.lazyload)
		window.removeEventListener("orientationChange", this.lazyload)
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
			sortData(events)
		} catch (err) {
		  	console.log(err)
		}
	}

	sortData = (events) => {
		this.data = {
			events: [...events]
			.filter(event => isEventInFuture(event.acf.startDate))
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
					tools.turnDateStringIntoIntObject(eventA.info.startDate), 
					tools.turnDateStringIntoIntObject(eventB.info.startDate)
				)
			})
		}
	}
	isEventInFuture = eventStart => {
		const currentDate = getDate()
		const eventDate = tools.turnDateStringIntoIntObject(eventStart)
		return tools.compareDates(currentDate, eventDate) === (0 || -1) ? true : false
	}
	this.getEventsByEvent = () => {
		return [...this.data.events].reduce(([hunter, leader], event) => {
			return event.event === "Jägarexamen (Intensiv)" ? [[...hunter, event], leader] : [hunter, [...leader, event]];
		}, [[], []])
	}

	getDate = () => {
		return {
			date: date.getDate(),
			month: date.getMonth() + 1,
			year: date.getFullYear(),
		}
	}
}


function Tools() {
	let throttle

	this.isWidthMobile = () => this.getScreenWidth() < 880
	this.isInWindow = param => param.offsetTop < (window.innerHeight + window.pageYOffset)
	this.getScreenWidth = () => screen.width

	this.throttle = (func, ms) => {
		if(throttle) clearTimeout(throttle)
		throttle = setTimeout(() => func(), ms)
	}

	this.turnNumberIntoMonth = number => {
		return months[number-1]
	}

	this.turnDateStringIntoIntObject = string => {
		arrray = string.split("/")
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