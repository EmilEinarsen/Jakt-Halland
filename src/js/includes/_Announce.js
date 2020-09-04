function Announce() {
	this.events = async() => {
<<<<<<< HEAD
		let [intensive, leader] = tools.structureApprouchingEvents(await server.getEvents())
		let events = intensive && leader ? `Nästa kurstillfällen: ` : `Nästa kurstillfälle: `
=======
		let [intensive, leader, calm] = tools.structureApprouchingEvents(await server.getEvents())
		let events = `Nästa kurstillfällen: `
>>>>>>> dev

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

		if(!(intensive || leader)) page.hideParent('#parallaxInfo')
		else page.addInnerOf('#parallaxInfo', events)
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