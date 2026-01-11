from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from uuid import UUID

from src.database import get_session
from src.models.task import Task, TaskCreate, TaskUpdate
from src.auth.jwt import get_current_user

router = APIRouter(prefix="/api/{user_id}/tasks", tags=["tasks"])

async def verify_user_match(user_id: str, current_user_id: str = Depends(get_current_user)):
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User ID mismatch"
        )
    return current_user_id

@router.post("/", response_model=Task, status_code=status.HTTP_201_CREATED)
async def create_task(
    user_id: str,
    task: TaskCreate,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(verify_user_match)
):
    db_task = Task.model_validate(task, update={"user_id": current_user_id})
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@router.get("/", response_model=List[Task])
async def read_tasks(
    user_id: str,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(verify_user_match)
):
    statement = select(Task).where(Task.user_id == current_user_id)
    results = session.exec(statement)
    return results.all()

@router.get("/{id}", response_model=Task)
async def read_task(
    user_id: str,
    id: UUID,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(verify_user_match)
):
    task = session.get(Task, id)
    if not task or task.user_id != current_user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task

@router.put("/{id}", response_model=Task)
async def update_task(
    user_id: str,
    id: UUID,
    task_update: TaskUpdate,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(verify_user_match)
):
    db_task = session.get(Task, id)
    if not db_task or db_task.user_id != current_user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    task_data = task_update.model_dump(exclude_unset=True)
    for key, value in task_data.items():
        setattr(db_task, key, value)

    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    user_id: str,
    id: UUID,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(verify_user_match)
):
    db_task = session.get(Task, id)
    if not db_task or db_task.user_id != current_user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    session.delete(db_task)
    session.commit()
    return None

@router.patch("/{id}/complete", response_model=Task)
async def toggle_task_completion(
    user_id: str,
    id: UUID,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(verify_user_match)
):
    db_task = session.get(Task, id)
    if not db_task or db_task.user_id != current_user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    db_task.is_completed = not db_task.is_completed
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task
