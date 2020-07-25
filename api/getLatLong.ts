import axios from 'axios';
import { NowRequest, NowResponse } from '@vercel/node';

const nearbySite = `http://nearby.org.uk/api/convert.php?key=80e885ee3dbdd7&output=text&p=`;
const testPlace = '462913,264647';

export default async (req: NowRequest, res: NowResponse) => {
  const response = await axios.get(`${nearbySite}${testPlace}`);

  res.json({
    req,
    response,
  });
};
