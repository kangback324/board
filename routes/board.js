const express = require('express');
const router = express.Router();
const pool = require('../libs/db.js');
const bcrypt = require('bcrypt');


/**
 * @swagger
 * /board/view/{post_id}:
 *   get:
 *     summary: Get a specific post or all posts
 *     tags:
 *       - Board
 *     parameters:
 *       - in: path
 *         name: post_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post or "all" to get all posts
 *     responses:
 *       200:
 *         description: A list of posts or a specific post
 *       404:
 *         description: Not found post
 *       500:
 *         description: Server error
 */
router.get('/view/:post_id', async (req, res) => {
    const db = await pool.getConnection();
    try {
        if (req.params.post_id === "all") {
            const [result] = await db.query('select post_id, title, content, author from posts');
            res.status(200).send(result);
        } else {
            const [result] = await db.query('select post_id, title, content, author from posts where post_id = ?',[req.params.post_id]);
            if (result.length === 0) {
                res.status(404).send("404 Not found post")
            }
            res.status(200).send(result);
        }
    } catch (err) {
        console.err(err);
        res.status(500).send("500 internet server error")
    } finally {
        db.release();
    }
});

/**
 * @swagger
 * /board/create:
 *   post:
 *     summary: Create a new post
 *     tags:
 *       - Board
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               password:
 *                 type: string
 *               author:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 *       500:
 *         description: Server error
 */
router.post('/create', async (req, res) => {
    const db = await pool.getConnection();
    try {
        const inform = req.body;
        const saltRounds = 10;
        const hashedpw = await bcrypt.hash(inform.password, saltRounds);
        await db.query('insert into posts values(null, ?, ?, ?, ?, now())',[inform.title, inform.content, hashedpw, inform.author]);
        res.status(201).send("201 done");
    } catch (err) {
        console.err(err);
        res.status(500).send("500 internet server error")
    } finally {
        db.release();
    }
});

/**
 * @swagger
 * /board/edit/{post_id}:
 *   put:
 *     summary: Edit a post
 *     tags:
 *       - Board
 *     parameters:
 *       - in: path
 *         name: post_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the post to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Password did not match
 *       404:
 *         description: Not found post
 *       500:
 *         description: Server error
 */
router.put('/edit/:post_id', async (req, res) => {
    const db = await pool.getConnection();
    try {
        const inform = req.body;
        const [pw] = await db.query('select password from posts where post_id = ?',[req.params.post_id]);
        if (pw.length === 0) {
            res.status(404).send("404 Not found post")
        }
        if (await bcrypt.compare(inform.password, pw[0].password)) {
            await db.query('update posts set title = ?, content = ? where post_id = ?',[inform.title, inform.content, req.params.post_id]);
            res.status(200).send("200 done");
        } else {
            res.status(400).send("Not match password")
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("internet server error")
    } finally {
        db.release();
    }
});

/**
 * @swagger
 * /board/delete/{post_id}:
 *   delete:
 *     summary: Delete a post
*     tags:
 *       - Board
 *     parameters:
 *       - in: path
 *         name: post_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the post to delete
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       204:
 *         description: Post deleted successfully
 *       400:
 *         description: Password did not match
 *       404:
 *         description: Not found post
 *       500:
 *         description: Server error
 */
router.delete('/delete/:post_id', async (req, res) => {
    const db = await pool.getConnection();
    try {
        const inform = req.body;
        const [pw] = await db.query('select password from posts where post_id = ?',[req.params.post_id]);
        if (pw.length === 0) {
            res.status(404).send("404 Not found post")
        }
        if (await bcrypt.compare(inform.password, pw[0].password)) {
            await db.query('delete from posts where post_id = ?',[req.params.post_id]);
            res.status(204).send("204 done");
        } else {
            res.status(400).send("Not match password")
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("500 internet server error")
    } finally {
        db.release();
    }
});

module.exports = router;