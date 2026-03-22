import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <h2>This site is used for all Advanced Web Development assignments</h2>
      <p>&nbsp;</p>

      <h3>Intro</h3>
      <p>
        Hello everyone, my name is Abayomi Osota. I am a senior at Kennesaw State University.
        My major is in Information Systems. I plan to graduate by next year summer.
        In my free time I either watch TV or hang out with friends.
      </p>
      <p>&nbsp;</p>

      <h3>Purpose of Page</h3>
      <p>The purpose of this page is to post links to assignments and everything else related to IT 4203.</p>
      <p>&nbsp;</p>

      <h3>Course Information</h3>
      <p>
        This course covers advanced topics on web site and application development that include
        server-side and client technologies, web services and APIs. This course has a focus on
        single-page web applications and web APIs, which has been the latest trends in modern web
        application development. Building upon your fundamental web site design and client-side
        development skills, this course enhances your web development skills at the client side,
        utilizing jQuery, JSON, and AJAX. You will complete at least one major project upon finishing
        this course.
      </p>
      <p>&nbsp;</p>

      <h3>Quick Links</h3>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
        <Link to="/books" className="btn">Google Books Search</Link>
        <Link to="/weather" className="btn">Weather App</Link>
        <Link to="/cloud-security-policy" className="btn">Cloud Security Policy</Link>
      </div>
    </div>
  );
}
