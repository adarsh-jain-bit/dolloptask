import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import User from '@/models/User';
import dbConnect from '@/libs/db';


dbConnect();

export async function POST(request) {
    console.log("in")
  const { email , password } = await request.json();

        const user = await User.findOne({email})
  if (!user) {
    return NextResponse.json({ error: 'User does not exist' }, { status: 401 });
  }

  const isPasswordValid = await compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username }, 
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const response = NextResponse.json({ message: 'Login successful' });
  response.cookies.set('authToken', token, {
    httpOnly: true,
    maxAge: Number("1d"),
    path: '/'
  });

  return response;
}
