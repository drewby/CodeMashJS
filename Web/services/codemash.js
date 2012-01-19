var request = require ('request'),
    datetime = require('datetime');
    
var sessionData = null;
var dateRegExp = /"\\\/Date\((-?\d+)\)\\\/"/g;

var sessions = exports.sessions = function(next) {
  var callback = next || function() {};

  if (sessionData != null) {
    callback(null, sessionData)
  } else {
      request('http://www.codemash.org/rest/sessions.json', function (error, response, body) {
        if (!error) {
          var body = body.replace(dateRegExp, '$1');
          sessionData = JSON.parse(body);
          
          sessionData.forEach(function(session) {
            session.ID = session.URI.replace('/rest/sessions/', '');
            
            session.Start = new Date(session.Start);
            
            session.Start.setMinutes( session.Start.getMinutes() + ( session.Start.getTimezoneOffset() - 300));
            session.StartString = datetime.format(session.Start, '%A %I:%M%p');

            session.End = new Date(session.Start);
            session.End.setMinutes(session.End.getMinutes() + 60);
            
            var utcStart = new Date(session.Start);
            utcStart.setHours( session.Start.getHours() + 5);
            session.StartUTCFormat = datetime.format(utcStart, '%Y%m%dT%H%M%SZ');

            var utcEnd = new Date(session.End);
            utcEnd.setHours( session.End.getHours() + 5);
            session.EndUTCFormat = datetime.format(utcEnd, '%Y%m%dT%H%M%SZ');
         });
      
        }
        
        callback(error, sessionData);
      });
  }
}

exports.getSession = function(id, next) {
  var callback = next || function() {};
  var session = null;
  
  sessions(function (error, sessionData) {
    var session = sessionData.filter(function(item) {
        return (item.ID == id);
    })[0];

    callback(error, session);
  });
}