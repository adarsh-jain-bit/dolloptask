import { NextResponse } from 'next/server';
import dbConnect from '@/libs/db';
import Task from '@/models/Task';
import jwt from 'jsonwebtoken';

async function getUserIdFromToken(request) {
  const token = request.cookies.get('authToken')?.value || request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function PUT(request, context) {
  await dbConnect();
  const userId = await getUserIdFromToken(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await context.params;
    const body = await request.json();
    
    const task = await Task.findOneAndUpdate(
      { _id: id, userId }, 
      body, 
      { new: true }
    );
    
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  await dbConnect();
  const userId = await getUserIdFromToken(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await context.params;
    const task = await Task.findOneAndDelete({ _id: id, userId });
    
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
