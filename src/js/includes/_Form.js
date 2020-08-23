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