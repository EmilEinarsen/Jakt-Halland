function Announce() {
	this.events = async() => {
		let [intensive, leader, calm] = tools.structureApprouchingEvents(await server.getEvents())
		let events = `Nästa kurstillfällen: `
		if(intensive) {
			page.addInnerOf('#intensiveEventDates', `Nästa kurstillfälle är den ${intensive}.<br><br>`)
			events = `${events} Intensiv Jägarexamen, den ${intensive}.`
		} else page.hideMe('#intensiveEventDates')
		
		if(calm) {
			page.addInnerOf('#calmEventDates', `Nästa kurstillfälle är den ${calm}.<br><br>`)
			events = `${events} Lugn Jägarexamen, den ${calm}.`
		} else page.hideMe('#calmEventDates')

		if(leader) {
			page.addInnerOf('#leadershipEventDates', `Nästa kurstillfälle är den ${leader}.<br><br>`)
			events = `${events} Jaktledarutbildning, den ${leader}.`
		} else page.hideMe('#leadershipEventDates')

		events = events + '<span><br>(Alla kurser hålls i laholmskomun)</span>'

		if(!(intensive || leader)) page.hideParent('#parallaxInfo')
		else page.addInnerOf('#parallaxInfo', events)
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