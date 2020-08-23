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
