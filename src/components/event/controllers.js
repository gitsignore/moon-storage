exports.getEvent = (req, res) => {
  res.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache'
  });
  res.locals.em.on('update_teams', () => {
    console.log('update_teams');
    const data = res.locals.db
      .get('teams')
      .sortBy('name')
      .value();
    console.log(data);
    res.write(`id: 1\nevent: update_teams\ndata: ${JSON.stringify(data)}\n\n\n`);
    // res.write('event: myEvent\nid: 1\ndata:This is event 1.\n\n\n');
    res.flush();
  });
};
