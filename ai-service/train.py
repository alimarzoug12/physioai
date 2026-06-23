# train.py
import os
import time
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def upload_training_file(file_path: str) -> str:
    print(f"Uploading {file_path}...")
    with open(file_path, "rb") as f:
        response = client.files.create(file=f, purpose="fine-tune")
    print(f"Uploaded: {response.id}")
    return response.id


def start_fine_tuning(file_id: str, model: str = "gpt-3.5-turbo") -> str:
    print(f"Starting fine-tuning on {model}...")
    job = client.fine_tuning.jobs.create(
        training_file=file_id,
        model=model,
        hyperparameters={"n_epochs": 3},
    )
    print(f"Job started: {job.id}")
    return job.id


def wait_for_completion(job_id: str):
    print("Waiting for completion...")
    while True:
        job = client.fine_tuning.jobs.retrieve(job_id)
        print(f"  Status: {job.status}")
        if job.status == "succeeded":
            print(f"Done! Model: {job.fine_tuned_model}")
            return job.fine_tuned_model
        if job.status in ("failed", "cancelled", "expired"):
            print(f"Job {job.status}: {job.error}")
            return None
        time.sleep(30)


def save_model_id(model_id: str):
    env_path = ".env"
    lines = []
    if os.path.exists(env_path):
        with open(env_path) as f:
            lines = f.readlines()
    found = False
    new_lines = []
    for line in lines:
        if line.startswith("OPENAI_FINE_TUNED_MODEL="):
            new_lines.append(f"OPENAI_FINE_TUNED_MODEL={model_id}\n")
            found = True
        else:
            new_lines.append(line)
    if not found:
        new_lines.append(f"\nOPENAI_FINE_TUNED_MODEL={model_id}\n")
    with open(env_path, "w") as f:
        f.writelines(new_lines)
    print(f"Saved to .env: {model_id}")


def check_status(job_id: str):
    job = client.fine_tuning.jobs.retrieve(job_id)
    print(f"Job: {job.id}")
    print(f"Status: {job.status}")
    print(f"Model: {job.fine_tuned_model}")
    for e in client.fine_tuning.jobs.list_events(job_id, limit=5).data:
        print(f"  [{e.created_at}] {e.message}")


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "status":
        check_status(sys.argv[2])
        exit()

    file_id = upload_training_file("training_data.jsonl")
    job_id  = start_fine_tuning(file_id)
    print(f"\nJob ID: {job_id}")
    print(f"Check anytime with: python train.py status {job_id}\n")

    model_id = wait_for_completion(job_id)
    if model_id:
        save_model_id(model_id)
