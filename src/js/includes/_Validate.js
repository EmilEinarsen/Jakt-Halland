
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
			const inputContent = queryTarget(`#${id}`).value.trim()
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