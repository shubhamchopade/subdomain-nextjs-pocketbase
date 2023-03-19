export interface User {
  city: string;
  country: string;
  first_name: string;
  gender: string;
  is_active: boolean;
  is_admin: boolean;
  last_name: string;
  occupation: string;
  profile_creted_at: string;
  user_id: number;
  user_name: string;
}

export interface RegisterUser {
  city: string;
  country: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  occupation: string;
  user_name: string;
  gender: string;
}

export interface ListUsers {
  page_no: number;
  records_per_page: number;
  token?: unknown;
}
export interface ListUsersResponse {
  status: boolean;
  data: {
    user_list: User[];
    pagination_data: {
      total_objects: number;
      toatl_page_no: number;
      start_index: number;
      end_index: number;
    };
  };
  message: string;
  statuscode: number;
}

export interface StaticProps {
  userData: User[];
  paginationData: ListUsersResponse;
}
