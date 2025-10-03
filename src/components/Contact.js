import React from 'react';

const Contact = () => {

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Message sent successfully!');
        e.target.reset();
    };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="contact-grid fade-in">
          <div className="contact-info">
            <h2>Connect</h2>
            <div className="info-item">
              <h4>Email</h4>
              <p>hello@minimal.com</p>
            </div>
            <div className="info-item">
              <h4>Phone</h4>
              <p>+1 234 567 890</p>
            </div>
            <div className="info-item">
              <h4>Location</h4>
              <p>New York, NY</p>
            </div>
          </div>

          <div className="contact-divider"></div>

          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input type="text" placeholder=" " required />
                <label>Name</label>
              </div>
              <div className="form-group">
                <input type="email" placeholder=" " required />
                <label>Email</label>
              </div>
              <div className="form-group">
                <textarea rows="4" placeholder=" " required></textarea>
                <label>Message</label>
              </div>
              <button type="submit" className="submit-btn">
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;