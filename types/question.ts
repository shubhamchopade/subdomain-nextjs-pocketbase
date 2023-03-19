import { Session } from "next-auth";

export interface Category {
  description: string;
  id: number;
  name: string;
}
export interface CategoryResponse {
  category__description: string;
  category__id: string;
  category__name: string;
}

export interface CreateQuestionResponse {
  status: boolean;
  data: {
    question_id: string;
    question_title: string;
  };
  message: string;
  statuscode: number;
}
export interface CreateSolutionResponse {
  status: boolean;
  data: {
    sample_solution_id: string;
    sample_solution: string;
  };
  message: string;
  statuscode: number;
}

export interface GetQuestionResponse {
  status: boolean;
  data: {
    question_id: number;
    question_details: {
      id: number;
      title: string;
      description: string;
      difficulty_level: string;
      is_locked: false;
      tag: [{ tag__id: number; tag__name: string }];
      category: CategoryResponse[];
      is_favourite_question: false;
      sample_solution: [
        {
          solution__id: number;
          solution__solution: string;
        }
      ];
      hint: [{ hint_description: string; hint_id: number }];
    };
  };
  message: string;
  statuscode: number;
}

export interface QuestionCategoryResponse {
  status: boolean;
  data: {
    category_list: Category[];
  };
  message: string;
  statuscode: number;
}

export interface Question {
  id: number;
  title: string;
  description: string;
  difficulty_level: string;
  is_locked: boolean;
  is_attempted: boolean;
  is_resolved: boolean;
  is_favourite: boolean;
}

export interface QuestionListPagination {
  total_objects: number;
  toatl_page_no: number;
  start_index: number;
  end_index: number;
}

export interface QuestionListResponse {
  status: boolean;
  data: {
    question_list: Question[];
    pagination_data: QuestionListPagination;
  };
  message: string;
  statuscode: number;
}

export interface getQuestionsStaticProps {
  questionData: Question[];
  paginationData: QuestionListPagination;
  session?: Session;
}
