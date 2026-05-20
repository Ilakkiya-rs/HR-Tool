import os
import json
import openai
from django.core.exceptions import ValidationError
from django.conf import settings
from .config import APP_CONFIG


class VaniEngine:
    @staticmethod
    def build_prompt(app_name: str, prompt_type: str, variables: dict) -> str:
        """
        Build a prompt from the config templates.
        """
        try:
            template = APP_CONFIG[app_name]["prompts"][prompt_type]
            return template.format(**variables)
        except KeyError as e:
            raise ValidationError(f"Invalid config key: {str(e)}")
        except Exception as e:
            raise ValidationError(f"Error building prompt: {str(e)}")

    @staticmethod
    def ask_ai_questions(test_length: int, prompt: str):
        """
        Generate assessment questions using OpenAI.
        """
        # openai.api_key = os.getenv("OPENAI_API_KEY", getattr(settings, "OPENAI_API_KEY", None))
        openai.api_key = os.getenv("OPENAI_API_KEY")

        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "user", "content": prompt}
                ],
            )

            interview_questions = response.choices[0].message.content.strip()

            # Remove markdown code block wrappers if present
            if "```json" in interview_questions:
                interview_questions = (
                    interview_questions.replace("```json", "")
                    .replace("```", "")
                    .strip()
                )
            elif "```" in interview_questions:
                interview_questions = interview_questions.replace("```", "").strip()

            # Parse JSON
            try:
                interview_questions_json = json.loads(interview_questions)
            except json.JSONDecodeError:
                raise ValidationError("Failed to parse assessment JSON from AI response")

            # Validate structure
            if "assessment" not in interview_questions_json:
                raise ValidationError("Invalid JSON structure: missing 'assessment' key")
            if "questions" not in interview_questions_json["assessment"]:
                raise ValidationError("Invalid JSON structure: missing 'questions' key")

            questions = interview_questions_json["assessment"]["questions"]

            if len(questions) != test_length:
                raise ValidationError(
                    f"Expected {test_length} questions, but received {len(questions)}"
                )

            return questions

        except Exception as e:
            raise ValidationError(f"Error generating assessment questions: {str(e)}")

    @staticmethod
    def ask_ai_answers(test_length: int, prompt: str):
        """
        Evaluate candidate answers using OpenAI.
        """
        # openai.api_key = os.getenv("OPENAI_API_KEY", getattr(settings, "OPENAI_API_KEY", None))
        openai.api_key = os.getenv("OPENAI_API_KEY")

        try:
            response = openai.ChatCompletion.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert technical assessor. Provide accurate, fair evaluations based on the evidence presented. Always return valid JSON in the exact format requested.",
                    },
                    {"role": "user", "content": prompt},
                ],
            )

            content = response.choices[0].message.content.strip()

            # Handle potential markdown wrapping
            if "```json" in content:
                json_start = content.find("```json") + 7
                json_end = content.find("```", json_start)
                json_content = content[json_start:json_end].strip()
            else:
                json_start = content.find("{")
                json_end = content.rfind("}") + 1
                json_content = content[json_start:json_end]

            try:
                assessment_result = json.loads(json_content)
                return assessment_result
            except json.JSONDecodeError:
                raise ValidationError("Failed to parse assessment JSON from AI response")

        except Exception as e:
            raise ValidationError(f"Error evaluating answers: {str(e)}")
