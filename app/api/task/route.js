

import { NextResponse } from 'next/server';
import Task from '@/models/Task';
import dbConnect from '@/libs/db';


dbConnect();
export async function POST(request){

    try {
        const reqBody = await request.json()
        const {title, description, status} = reqBody


        const newTask = new Task({
          title, description, status
        })

        const SavedTask = await newTask.save()


        return NextResponse.json({
            message: "Task created successfully",
            success: true,
            SavedTask
        })


    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})

    }
}
