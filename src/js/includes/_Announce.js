function Announce() {
	this.events = async() => {
		const [intensive, leader] = tools.structureApprouchingEvents(await server.getEvents())
		page.addInnerOf(
			'#parallaxInfo', 
			`Nästa kurstillfällen: <span>Intensiv Jägarexamen, den ${intensive}.</span> <span>Jaktledarutbildning, den ${leader}.</span>`
		)
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