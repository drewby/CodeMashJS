var codemash = require('../services/codemash.js'), 
  datetime = require('datetime');

/*
 * GET home page.
 */

exports.index = function(req, res){
  codemash.sessions(function(error,sessionData) {
    res.render('index', { title: 'CodeMash Sessions', sessions: sessionData })
  });
};

exports.view = function(req, res){
  var id = req.params.id;
  codemash.getSession(id, function(error,session) {
    res.render('session', { title: session.Title, session: session })
  });
};

exports.ics = function(req, res){
  var id = req.params.id;
  codemash.getSession(id, function(error,session) {
    res.setHeader('Content-Type', 'text/calendar');
    res.write('BEGIN:VCALENDAR\n');
    res.write('VERSION:2.0\n');
    res.write('PRODID:-//drewby//codemash//EN\n');
    res.write('BEGIN:VEVENT\n');
    res.write('UID:' + session.ID + '\n');
    res.write('DTSTART;VALUE=DATE:' + session.StartUTCFormat + '\n');
    res.write('DTEND;VALUE=DATE:' + session.EndUTCFormat + '\n');
    res.write('SUMMARY;CHARSET=utf-8:' + session.Title + '\n');
    res.write('LOCATION;CHARSET=utf-8:' + session.Room + '\n');
    res.write('URL:http://codemash.org' + session.URI + '\n');
    res.write('DESCRIPTION:' + session.Abstract + '\n'); 
    res.write('END:VEVENT\n');
    res.write('END:VCALENDAR\n');
    res.end();
  });
};