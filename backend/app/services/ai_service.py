import json
from google import genai
from google.genai import types
from app.core.config import settings
from app.models.project import Project

# Initialize Gemini API
client = genai.Client(api_key=settings.GEMINI_API_KEY)


def validate_idea(project: Project) -> dict:
    """
    Calls the Gemini API to validate a startup idea.
    Enforces a JSON schema response.
    """
    prompt = f"""
    You are an expert Silicon Valley VC and startup incubator.
    Please analyze the following startup idea and return your analysis strictly as a JSON object.
    
    Startup Name: {project.name}
    Industry: {project.industry}
    Description: {project.description}
    
    Respond ONLY with a JSON object matching this exact structure, with no markdown formatting or code blocks around it:
    {{
        "overall_score": <int between 1-100 representing viability>,
        "problem_analysis": {{
            "score": <int 1-100>,
            "feedback": "<string: 2-3 sentences analyzing if the problem is real and painful>",
            "target_audience": "<string: who exactly has this problem>"
        }},
        "solution_analysis": {{
            "score": <int 1-100>,
            "feedback": "<string: 2-3 sentences analyzing if the solution actually solves the problem effectively>",
            "unique_value_proposition": "<string: what makes this solution stand out>"
        }}
    }}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
        ),
    )

    try:
        data = json.loads(response.text)
        return data
    except json.JSONDecodeError:
        raise ValueError("AI returned invalid JSON formatting.")


def generate_market_research(project: Project) -> dict:
    """
    Calls the Gemini API to generate market research.
    Enforces a JSON schema response.
    """
    prompt = f"""
    You are an expert Silicon Valley market researcher and business analyst.
    Please analyze the market for the following startup idea and return your analysis strictly as a JSON object.
    
    Startup Name: {project.name}
    Industry: {project.industry}
    Description: {project.description}
    
    Provide realistic estimated dollar amounts for TAM, SAM, and SOM where applicable (e.g. "$10.5B"). 
    
    Respond ONLY with a JSON object matching this exact structure, with no markdown formatting or code blocks around it:
    {{
        "tam_sam_som": {{
            "tam": {{"value": "<string>", "description": "<string: brief explanation>"}},
            "sam": {{"value": "<string>", "description": "<string: brief explanation>"}},
            "som": {{"value": "<string>", "description": "<string: brief explanation>"}}
        }},
        "target_demographics": [
            {{
                "segment_name": "<string>",
                "characteristics": "<string: age, location, income, etc>",
                "pain_points": ["<string>", "<string>"]
            }},
            // Provide 2 to 3 target demographics
        ],
        "market_trends": [
            {{
                "trend_name": "<string>",
                "impact": "<string: how it affects the startup positive or negative>",
                "timeline": "<string: short-term, long-term, etc>"
            }},
            // Provide 3 to 4 market trends
        ]
    }}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
        ),
    )

    try:
        data = json.loads(response.text)
        return data
    except json.JSONDecodeError:
        raise ValueError("AI returned invalid JSON formatting.")


def generate_competitor_analysis(project: Project) -> dict:
    """
    Calls the Gemini API to generate a competitor analysis and SWOT matrix.
    """
    prompt = f"""
    You are an expert Silicon Valley startup strategist.
    Please analyze the competitors and generate a SWOT analysis for the following startup idea.
    
    Startup Name: {project.name}
    Industry: {project.industry}
    Description: {project.description}
    
    If there are no direct competitors, identify the closest indirect competitors or established players in adjacent spaces.
    
    Respond ONLY with a JSON object matching this exact structure, with no markdown formatting or code blocks around it:
    {{
        "competitors": [
            {{
                "name": "<string: Competitor Name>",
                "description": "<string: Brief 1-sentence description>",
                "strengths": ["<string>", "<string>"],
                "weaknesses": ["<string>", "<string>"]
            }},
            // Provide 3 to 4 competitors
        ],
        "swot_analysis": {{
            "strengths": ["<string>", "<string>", "<string>"],
            "weaknesses": ["<string>", "<string>", "<string>"],
            "opportunities": ["<string>", "<string>", "<string>"],
            "threats": ["<string>", "<string>", "<string>"]
        }}
    }}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
        ),
    )

    try:
        data = json.loads(response.text)
        return data
    except json.JSONDecodeError:
        raise ValueError("AI returned invalid JSON formatting.")


def generate_business_model(project: Project) -> dict:
    """
    Calls the Gemini API to generate a 9-block Business Model Canvas.
    """
    prompt = f"""
    You are an expert Silicon Valley startup strategist.
    Please generate a comprehensive 9-block Business Model Canvas for the following startup idea.
    
    Startup Name: {project.name}
    Industry: {project.industry}
    Description: {project.description}
    
    Respond ONLY with a JSON object matching this exact structure, with no markdown formatting or code blocks around it. 
    Each block should contain an array of 2 to 4 highly specific, actionable bullet points (strings).
    
    {{
        "canvas_data": {{
            "key_partners": ["<string>", "<string>"],
            "key_activities": ["<string>", "<string>"],
            "key_resources": ["<string>", "<string>"],
            "value_propositions": ["<string>", "<string>"],
            "customer_relationships": ["<string>", "<string>"],
            "channels": ["<string>", "<string>"],
            "customer_segments": ["<string>", "<string>"],
            "cost_structure": ["<string>", "<string>"],
            "revenue_streams": ["<string>", "<string>"]
        }}
    }}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
        ),
    )

    try:
        data = json.loads(response.text)
        return data
    except json.JSONDecodeError:
        raise ValueError("AI returned invalid JSON formatting.")


def generate_financial_forecast(project: Project) -> dict:
    """
    Calls the Gemini API to generate a hypothetical financial forecast.
    """
    prompt = f"""
    You are an expert Silicon Valley Pre-Seed VC Analyst.
    Please generate a conservative, realistic hypothetical financial forecast for the first 12 months of the following startup idea.
    
    Startup Name: {project.name}
    Industry: {project.industry}
    Description: {project.description}
    
    Respond ONLY with a JSON object matching this exact structure, with no markdown formatting or code blocks around it.
    
    {{
        "initial_investment_needed": "<string: realistic dollar amount, e.g. '$250,000'>",
        "monthly_burn_rate": "<string: realistic dollar amount, e.g. '$20,000'>",
        "cost_breakdown": [
            {{
                "category": "<string: e.g. Engineering, Marketing, Operations>",
                "percentage": <int: percentage value between 1 and 100, must sum to 100 overall>
            }}
            // Provide 4 to 5 categories
        ],
        "revenue_milestones": [
            {{
                "month": "<string: e.g. Month 3, Month 6>",
                "target": "<string: e.g. First 100 paying users>",
                "expected_revenue": "<string: e.g. '$5,000 MRR'>"
            }}
            // Provide 3 to 4 milestones
        ]
    }}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
        ),
    )

    try:
        data = json.loads(response.text)
        return data
    except json.JSONDecodeError:
        raise ValueError("AI returned invalid JSON formatting.")

def generate_brand_assets(project: Project) -> dict:
    """
    Calls the Gemini API to generate brand assets for the startup.
    """
    prompt = f"""
    You are an expert Creative Director and Brand Strategist.
    Please generate a cohesive brand identity for the following startup idea.
    
    Startup Name: {project.name}
    Industry: {project.industry}
    Description: {project.description}
    
    Respond ONLY with a JSON object matching this exact structure, with no markdown formatting or code blocks around it.
    
    {{
        "brand_name_ideas": [
            {{
                "name": "<string: A catchy name idea>",
                "rationale": "<string: Brief explanation of why it works>"
            }}
            // Provide 3 to 4 name ideas
        ],
        "brand_archetype": "<string: e.g. The Magician, The Creator, The Explorer - explain briefly>",
        "color_palette": [
            {{
                "role": "<string: Primary, Secondary, Accent 1, Accent 2>",
                "hex": "<string: Valid hex code like '#10B981'>",
                "meaning": "<string: Psychological meaning>"
            }}
            // Provide exactly 4 colors
        ],
        "typography_suggestions": [
            {{
                "usage": "<string: Headers or Body>",
                "font_family": "<string: A popular Google Font, e.g. 'Inter' or 'Playfair Display'>",
                "rationale": "<string: Why this font fits the brand>"
            }}
            // Provide exactly 2 suggestions: one for Headers, one for Body
        ]
    }}
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
        ),
    )
    
    try:
        data = json.loads(response.text)
        return data
    except json.JSONDecodeError:
        raise ValueError("AI returned invalid JSON formatting.")

def generate_pitch_deck(project: Project) -> dict:
    """
    Calls the Gemini API to generate a 10-slide VC pitch deck.
    """
    prompt = f"""
    You are an expert Silicon Valley Startup Founder and Pitch Coach.
    Please generate a highly compelling 10-slide VC Pitch Deck outline for the following startup idea.
    
    Startup Name: {project.name}
    Industry: {project.industry}
    Description: {project.description}
    
    The standard 10 slides are usually: 
    1) Title/Hook, 2) The Problem, 3) The Solution, 4) Market Timing/Why Now, 5) Market Size, 
    6) Product/How it Works, 7) Business Model, 8) Competition, 9) Team/Traction, 10) The Ask/Financials.
    
    Respond ONLY with a JSON object matching this exact structure, with no markdown formatting or code blocks around it.
    
    {{
        "slides": [
            {{
                "title": "<string: Slide Title, e.g. 'The Problem'>",
                "content": [
                    "<string: Bullet point 1>",
                    "<string: Bullet point 2>"
                ],
                "speaker_notes": "<string: A compelling paragraph of what the founder should say out loud when presenting this slide>"
            }}
            // Provide exactly 10 slides
        ]
    }}
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
        ),
    )
    
    try:
        data = json.loads(response.text)
        return data
    except json.JSONDecodeError:
        raise ValueError("AI returned invalid JSON formatting.")

def generate_mvp_scope(project: Project) -> dict:
    """
    Calls the Gemini API to generate an MVP feature roadmap.
    """
    prompt = f"""
    You are an expert Agile Product Manager and Technical Lead.
    Please generate a Minimum Viable Product (MVP) feature scope for the following startup idea.
    
    Startup Name: {project.name}
    Industry: {project.industry}
    Description: {project.description}
    
    Respond ONLY with a JSON object matching this exact structure, with no markdown formatting or code blocks around it.
    
    {{
        "must_have_features": [
            {{ "name": "<string: Feature Name>", "description": "<string: Why it's critical for the MVP>" }}
        ],
        "should_have_features": [
            {{ "name": "<string: Feature Name>", "description": "<string: Important but not launch-blocking>" }}
        ],
        "nice_to_have_features": [
            {{ "name": "<string: Feature Name>", "description": "<string: Good for v2.0>" }}
        ],
        "timeline": [
            {{ 
                "phase": "<string: e.g. Weeks 1-2>", 
                "description": "<string: Phase goal>", 
                "milestones": ["<string: milestone 1>", "<string: milestone 2>"] 
            }}
            // Provide 3-4 timeline phases covering the MVP build
        ]
    }}
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
        ),
    )
    
    try:
        data = json.loads(response.text)
        return data
    except json.JSONDecodeError:
        raise ValueError("AI returned invalid JSON formatting.")

def generate_user_personas(project: Project) -> dict:
    """
    Calls the Gemini API to generate target user personas.
    """
    prompt = f"""
    You are an expert User Researcher and Marketing Strategist.
    Please generate 3 highly detailed Target User Personas for the following startup idea.
    
    Startup Name: {project.name}
    Industry: {project.industry}
    Description: {project.description}
    
    Respond ONLY with a JSON object matching this exact structure, with no markdown formatting or code blocks around it.
    
    {{
        "personas": [
            {{
                "name": "<string: A fictional name, e.g. 'Startup Steve'>",
                "role": "<string: Their job title or role>",
                "demographics": {{
                    "age": "<string: e.g. 28-35>",
                    "income": "<string: e.g. $80k-$120k>",
                    "location": "<string: e.g. Urban Tech Hubs>"
                }},
                "pain_points": [
                    "<string: Specific pain point 1>",
                    "<string: Specific pain point 2>",
                    "<string: Specific pain point 3>"
                ],
                "motivations": [
                    "<string: Motivation 1>",
                    "<string: Motivation 2>"
                ],
                "where_to_find_them": [
                    "<string: Marketing channel 1, e.g. 'LinkedIn SaaS Groups'>",
                    "<string: Marketing channel 2, e.g. 'HackerNews'>"
                ]
            }}
            // Provide exactly 3 distinct personas
        ]
    }}
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
        ),
    )
    
    try:
        data = json.loads(response.text)
        return data
    except json.JSONDecodeError:
        raise ValueError("AI returned invalid JSON formatting.")

def generate_gtm_strategy(project: Project) -> dict:
    """
    Calls the Gemini API to generate a Go-To-Market (GTM) Strategy.
    """
    prompt = f"""
    You are an expert Chief Marketing Officer (CMO) and Startup Advisor.
    Please generate a comprehensive Go-To-Market (GTM) Strategy for the following startup idea.
    
    Startup Name: {project.name}
    Industry: {project.industry}
    Description: {project.description}
    
    Respond ONLY with a JSON object matching this exact structure, with no markdown formatting or code blocks around it.
    
    {{
        "phases": [
            {{
                "name": "<string: e.g. Phase 1: Pre-launch>",
                "duration": "<string: e.g. Weeks 1-4>",
                "key_activities": [
                    "<string: Activity 1>",
                    "<string: Activity 2>"
                ]
            }}
            // Provide 3 phases: Pre-launch, Launch Day, Post-Launch Growth
        ],
        "marketing_channels": [
            {{
                "channel_name": "<string: e.g. Content SEO>",
                "strategy": "<string: How to utilize this channel effectively>",
                "budget_allocation": "<string: e.g. 20% or $500/mo>"
            }}
            // Provide exactly 4-5 marketing channels
        ],
        "success_metrics": [
            "<string: Key Performance Indicator 1 (e.g. CAC < $15)>",
            "<string: KPI 2>",
            "<string: KPI 3>"
        ]
    }}
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
        ),
    )
    
    try:
        data = json.loads(response.text)
        return data
    except json.JSONDecodeError:
        raise ValueError("AI returned invalid JSON formatting.")

def generate_legal_compliance(project: Project) -> dict:
    """
    Calls the Gemini API to generate a Legal & Compliance Checklist.
    """
    prompt = f"""
    You are an expert Startup Attorney and Compliance Officer.
    Please generate a tailored Legal and Compliance Checklist for the following startup idea.
    
    Startup Name: {project.name}
    Industry: {project.industry}
    Description: {project.description}
    
    Respond ONLY with a JSON object matching this exact structure, with no markdown formatting or code blocks around it.
    
    {{
        "corporate_structure": {{
            "recommendation": "<string: e.g. Delaware C-Corp>",
            "reasoning": "<string: Why this structure is best for this specific startup>"
        }},
        "compliance_requirements": [
            {{
                "name": "<string: e.g. GDPR & CCPA>",
                "description": "<string: Brief explanation of the regulation>",
                "action_items": [
                    "<string: Action item 1 (e.g. Implement cookie consent)>",
                    "<string: Action item 2>"
                ]
            }}
            // Provide 2-4 critical compliance regulations for this industry
        ],
        "essential_documents": [
            {{
                "name": "<string: e.g. Terms of Service>",
                "purpose": "<string: Why it is needed>"
            }}
            // Provide 3-5 essential legal documents
        ]
    }}
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
        ),
    )
    
    try:
        data = json.loads(response.text)
        return data
    except json.JSONDecodeError:
        raise ValueError("AI returned invalid JSON formatting.")

def generate_growth_experiments(project: Project) -> dict:
    """
    Calls the Gemini API to generate Growth Experiments (A/B tests).
    """
    prompt = f"""
    You are an expert Head of Growth and Product Manager.
    Please generate 3-5 highly actionable growth experiments (A/B tests) for the following startup idea to find Product-Market Fit.
    
    Startup Name: {project.name}
    Industry: {project.industry}
    Description: {project.description}
    
    Respond ONLY with a JSON object matching this exact structure, with no markdown formatting or code blocks around it.
    
    {{
        "experiments": [
            {{
                "title": "<string: e.g. Test LinkedIn Ads vs Twitter Ads>",
                "hypothesis": "<string: If we do X, then Y will happen because Z>",
                "metric_to_track": "<string: e.g. Cost per Click (CPC) or Conversion Rate>",
                "duration_days": <integer: e.g. 7>
            }}
            // Provide 3-5 experiments
        ]
    }}
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
        ),
    )
    
    try:
        data = json.loads(response.text)
        return data
    except json.JSONDecodeError:
        raise ValueError("AI returned invalid JSON formatting.")
