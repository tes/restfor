module.exports = (service, mapReqToParams = req => ({})) => async (req, res) => {
  try {
    const result = await service(mapReqToParams(req));
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    const [ message, status ] = error.message.split('|');
    res.status(status ? Number(status) : 500).send({ message });
  }
};
