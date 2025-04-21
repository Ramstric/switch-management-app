export function onRequest (context, next) {
    const { cookies, url, redirect } = context;

    if (url.pathname.startsWith('/switch-management-app/api/')) {
        // Allow API requests to pass through without authentication
        return next();
    } else if (url.pathname.endsWith('/dashboard')) {
        const authToken = cookies.get('authToken')?.value;

        // Check if the auth token is present
        if (!authToken) {
            // Redirect to the login page if the auth token is not present
            return redirect('/switch-management-app/', 302);
            
        }
    } else {
        // Check if the auth token is present for other paths
        const authToken = cookies.get('authToken')?.value;
        if (authToken) {
            // Redirect to the dashboard if the auth token is present
            return redirect('/switch-management-app/dashboard', 302);
        }
    }

    // return a Response or the result of calling `next()`
    return next();
};