import {queryTarget, queryTargetAll} from './helpers'

export default function Form() {
	const xhr = new XMLHttpRequest()

	this.requestMailing = e => {
		const [errors, isValid] = validate(e)
		if(isValid) attemptDispatch()
		else displayFeedback(errors)
	}
	const attemptDispatch = () => {
		xhr.open(form.method, form.action)
		xhr.setRequestHeader("Accept", "application/json")
		xhr.onreadystatechange = () => {
			if (xhr.readyState !== XMLHttpRequest.DONE) return
			if(xhr.status === 200) success()
		}
		xhr.send(fetchContent())
	}
	const validate = e => {
		let errors = {name: '', subject: '', email: '', message: ''}
		const input = e.target.elements
		const inputContent = { 
			name: input.name.value.trim(), 
			subject: input.subject.value.trim(), 
			email: input.email.value.trim(), 
			message: input.message.value.trim()
		}
		if(inputContent.name === '') errors.name = `Namn måste anges`
		if(inputContent.subject === '') errors.subject = `Du måste ange ett ämne`
		if(inputContent.email === '') errors.email = `E-post måste anges`
		if(inputContent.message === '') errors.message = `Du saknar ett meddelande`
		for(let key in errors) {
			if(errors[key] !== '') return [errors, false]
		}
		return [errors, true]
	}
	const fetchContent = () => new FormData(form)
	const success = () => {
		resetForm()
	}
	const displayFeedback = errors => {
		for(let key in errors) 
			errors[key] !== '' ? displayInputError(errors[key], key) : displayInputSuccess(key)
	}
	this.toggleInputFocus = (e) => {
		if(!e) { [...queryTargetAll(".focus")].map(input => input.classList.remove("focus")); return}
		if(e.target.value) return
		e.target.parentElement.classList.toggle("focus")
	}
	this.removeClassSuccessIfInputEmpty = e => {
		if(e.target.value) return
		e.target.classList.remove('success')
	}
	const displayInputSuccess = key => {
		page.addInnerOf(`#${key}Feedback`, '')
		queryTarget(`#${key}`).classList.remove('error')
		queryTarget(`#${key}`).classList.add('success')
	}
	const displayInputError = (error, key) => {
		page.addInnerOf(`#${key}Feedback`, `<i class="fas fa-exclamation-circle"></i> ${error}`)
		queryTarget(`#${key}`).classList.remove('success')
		queryTarget(`#${key}`).classList.add('error')
	}
	const resetForm = () => {
		form.reset()
		this.toggleInputFocus()
	}
}