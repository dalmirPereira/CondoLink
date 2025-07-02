import { Router, Request, Response } from 'express';
const { handleMissingFields } = require('../controllers/registerControllers');
const { findEmail, createUser } = require('../services/userServices');

//Require needed for uncrypting the password
const bcrypt = require('bcrypt');
const { saltRound } = require('../config/saltRound')

interface Resident {
  fullName: string;
  email: string;
  password: string;
  buildingId: number;
  blockId: number;
  unit: string;
}

const router = Router();

router.post("/user", async (
  req: Request<{}, {}, Resident>, 
  res: Response<any>
): Promise<void> => {
  
  //get user and password form client
  const newResident = req.body;

  // check for missing fields
  const missingFields = await handleMissingFields(newResident);
  if (missingFields.length > 0) {
      return res.status(400).json({
          message: `The following fields are required and missing or wrong: ${missingFields.join(', ')}`
      });
  }

  // check for duplicate email in the db
  const duplicate = await findEmail(newResident.email);
  console.log(duplicate);
  if (duplicate && duplicate.length>0) {
    return res.status(409).json({ message: 'Email already registered. Choose another email.' })
  }; //Conflict 
  
  try {

      //encrypt the password
      const hashedPwd = await bcrypt.hash(newResident.password, saltRound);
      //update password
      newResident.password = hashedPwd

      //create and store the new user:
      const result = await createUser(newResident);
      console.log(result);

      res.status(201).json({ 'success': `New user ${newResident.email} created!` });
  
  } catch (err: any) {
      res.status(500).json({ 'message': err.message });
  }
});

module.exports = router;