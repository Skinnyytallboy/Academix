1. in requestAdminPage, i have to add functionallity of mail sending...
Where to find these values:
    Service ID: Dashboard > Email Services > Select Your Service.
    Template ID: Dashboard > Email Templates > Select Your Template.
    User ID: Account > API Keys > User ID.
After setting these values correctly, the emailjs.send function should work as expected and send the email to the specified addresses.
To make the email sending work using EmailJS, you need to replace the following placeholders in the code:
    'service_id': This is the unique identifier for the service you've created in EmailJS. You can find it in the EmailJS dashboard under Services.
    'template_id': This is the ID of the template you are using to send the email. You'll define this when setting up a template in EmailJS.
    'user_id': This is the public user ID for your EmailJS account. You can find it in your EmailJS account settings under API Keys.
Steps to get these values:
    Sign up/log in to EmailJS:
        Go to EmailJS and log in to your account or sign up if you don't have one.
    Create a Service:
        Go to the Email Services section and create an email service (e.g., Gmail, Outlook, etc.). This service will be used to send emails.
    Create a Template:
        Go to the Email Templates section and create a new email template.
        In your template, you'll need to define variables like from_email, message, and to_email, which will be replaced with the actual values you provide when you send the email.
    Get service_id and template_id:
        Once you create a service and template, you can find their IDs on the Email Services and Email Templates pages respectively in your EmailJS dashboard.
    Find user_id:
        Go to the Account section in EmailJS and find the user_id (API key) under User ID.
Example:
If your service_id, template_id, and user_id are as follows:
    Service ID: service_abc123
    Template ID: template_def456
    User ID: user_789xyz
Then you can update your code like this:



2. I implemented / for login so think on that whether i am doing it right or i have to change that



updated schema