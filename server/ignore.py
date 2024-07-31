# @app.before_request
# def authenticate():
#     exempted_routes = {
#         "/": ["GET"],
#         "/signup": ["POST"],
#         "/login": ["POST"],
#         "/me": ["GET"],
#         "/logout": ["DELETE"]
#     }

#     if request.path in exempted_routes:
#         allowed_methods = exempted_routes[request.path]

#         if request.method in allowed_methods:
#             return None
        
#     if 'user' not in session:
#         return make_response({"message": "Unauthorised"}, 403)