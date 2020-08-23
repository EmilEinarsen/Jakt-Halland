function Announce() {
	this.events = async() => {
		const [intensive, leader] = tools.structureApprouchingEvents(await server.getEvents())
		page.addInnerOf(
			'#navbarInfo', 
			`Nästa kurstillfällen: Intensiv Jägarexamen, den ${intensive}. Jaktledarutbildning, den ${leader}.`
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