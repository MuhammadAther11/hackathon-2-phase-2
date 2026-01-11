from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
from uuid import UUID

from src.database import get_session
from src.models.task import Task, TaskCreate, TaskUpdate
from src.middleware.auth import get_current_user_id
from src.services.task_service import (
    get_user_tasks,
    create_task,
    get_task_by_id,
    update_task,
    delete_task,
    toggle_task_completion
)

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/", response_model=List[Task])
async def read_tasks(
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    tasks = get_user_tasks(session=session, user_id=current_user_id)
    return tasks

@router.post("/", response_model=Task, status_code=status.HTTP_201_CREATED)
async def create_task_endpoint(
    task: TaskCreate,
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    db_task = create_task(session=session, task_create=task, user_id=current_user_id)
    return db_task

@router.get("/{id}", response_model=Task)
async def read_task(
    id: UUID,
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    task = get_task_by_id(session=session, task_id=id, user_id=current_user_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task

@router.put("/{id}", response_model=Task)
async def update_task_endpoint(
    id: UUID,
    task_update: TaskUpdate,
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    updated_task = update_task(
        session=session,
        task_id=id,
        task_update=task_update,
        user_id=current_user_id
    )
    if not updated_task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return updated_task

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task_endpoint(
    id: UUID,
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    success = delete_task(session=session, task_id=id, user_id=current_user_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return None

@router.patch("/{id}/toggle", response_model=Task)
async def toggle_task_completion_endpoint(
    id: UUID,
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    toggled_task = toggle_task_completion(session=session, task_id=id, user_id=current_user_id)
    if not toggled_task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return toggled_task
