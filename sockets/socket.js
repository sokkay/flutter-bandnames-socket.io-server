const { io } = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Muse'));
bands.addBand(new Band('Metallica'));
bands.addBand(new Band('Bon Jovi'));

io.on('connection', (client) => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', (data) => {
        console.log();
    });

    client.on('emitir-mensaje', (payload) => {
        // io.emit('nuevo-mensaje', payload); // emite a todos!
        client.broadcast.emit('nuevo-mensaje', payload); // emite a todos menos el que lo emitio
    });

    client.on('vote-band', (data) => {
        bands.voteBand(data.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (data) => {
        bands.addBand(new Band(data.name));
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (data) => {
        bands.deleteBands(data.id);
        io.emit('active-bands', bands.getBands());
    });
});
